import * as vscode from 'vscode';
const {Etcd3} = require('etcd3');

export class EtcdTreeProvider implements vscode.TreeDataProvider<EtcdTreeItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<EtcdTreeItem | undefined> =
    new vscode.EventEmitter<EtcdTreeItem | undefined>();
  readonly onDidChangeTreeData: vscode.Event<EtcdTreeItem | undefined> =
    this._onDidChangeTreeData.event;

  public etcdClient: any;
  private allKeys: string[] = [];
  private filteredKeys: string[] = [];

  constructor() {
    const config = vscode.workspace.getConfiguration('vEtcdExplorer');
    const etcdUrl = config.get<string>('etcdUrl')?.split(',') || 'http://localhost:2379';
    this.etcdClient = new Etcd3({
      endpoints: [etcdUrl]
    });
    this.fetchAllKeys();
  }

  async fetchAllKeys(): Promise<void> {
    this.allKeys = await this.etcdClient.getAll().keys();
    this.filteredKeys = [...this.allKeys]; // Initially show all keys
    this.refresh();
  }

  refresh(): void {
    this._onDidChangeTreeData.fire(undefined);
  }

  getTreeItem(element: EtcdTreeItem): vscode.TreeItem {
    return element;
  }

  async getChildren(element?: EtcdTreeItem): Promise<EtcdTreeItem[]> {
    if (element) {
      return [];
    } else {
      // Return filtered keys
      return this.filteredKeys.map((key: string) => new EtcdTreeItem(key));
    }
  }

  filterKeys(substring: string): void {
    if (substring) {
      this.filteredKeys = this.allKeys.filter((key) => key.includes(substring));
    } else {
      this.filteredKeys = [...this.allKeys]; // Reset to all keys if no substring is provided
    }
    this.refresh();
  }
}

export class EtcdTreeItem extends vscode.TreeItem {
  constructor(
    public readonly key: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState = vscode
      .TreeItemCollapsibleState.None
  ) {
    super(key, collapsibleState);

    this.command = {
      title: 'Show Details',
      command: 'etcdExplorer.showDetails',
      arguments: [this.key],
    };
    this.contextValue = 'etcdTreeItem';
  }
}

export function activate(context: vscode.ExtensionContext) {
  const etcdTreeProvider = new EtcdTreeProvider();
  vscode.window.registerTreeDataProvider('etcdTree', etcdTreeProvider);

  // Refresh command
  const refreshCommand = vscode.commands.registerCommand(
    'etcdExplorer.refreshTree',
    () => {
      etcdTreeProvider.fetchAllKeys();
    }
  );

  // Search keys based on substring
  const searchKeysCommand = vscode.commands.registerCommand(
    'etcdExplorer.searchKeys',
    async () => {
      const substring = await vscode.window.showInputBox({
        placeHolder: 'Enter a substring to filter keys',
      });
      if (substring !== undefined) {
        etcdTreeProvider.filterKeys(substring);
      }
    }
  );

  // Show details of a specific key
  const showDetailsCommand = vscode.commands.registerCommand('etcdExplorer.showDetails', async (key: string) => {
    const client = new Etcd3();
    const config = vscode.workspace.getConfiguration('vEtcdExplorer');
    const defaultType = config.get<string>('documentDefaultLanguage') || 'json';
    try {
        const value = await client.get(key).string();
        if (value) {
            // Check if a document for the given key is already open
            const existingDoc = vscode.workspace.textDocuments.find(doc => doc.uri.fsPath === key);
            if (existingDoc) {
                // Show the existing document
                await vscode.window.showTextDocument(existingDoc, { preserveFocus: true });
            } else {
                // Create a new document only if it doesn't exist
                const doc = await vscode.workspace.openTextDocument({
                    content: value,
                    language: defaultType
                });

                // Show the new document in a single tab
                await vscode.window.showTextDocument(doc, { preserveFocus: true, preview: true });
            }
        } else {
            vscode.window.showErrorMessage(`No value found for key: ${key}`);
        }
    } catch (error: any) {
        vscode.window.showErrorMessage(`Error fetching key: ${key}, ${error.message}`);
    }
});


  // Add key command
  const addKeyCommand = vscode.commands.registerCommand(
    'etcdExplorer.addKey',
    async () => {
      const key = await vscode.window.showInputBox({placeHolder: 'Enter key'});
      const value = await vscode.window.showInputBox({
        placeHolder: 'Enter value',
      });
      if (key && value) {
        try {
          await etcdTreeProvider.etcdClient.put(key).value(value);
          vscode.window.showInformationMessage(
            `Key ${key} added successfully!`
          );
          etcdTreeProvider.fetchAllKeys(); // Refresh the list
        } catch (error: any) {
          vscode.window.showErrorMessage(`Failed to add key: ${error.message}`);
        }
      }
    }
  );
  const updateUrlCommand = vscode.commands.registerCommand('etcdExplorer.updateUrl', async () => {
    const currentUrl = vscode.workspace.getConfiguration('etcdExplorer').get<string>('etcdUrl');
    const newUrl = await vscode.window.showInputBox({
        prompt: 'Enter the new etcd URL',
        value: currentUrl
    });

    if (newUrl) {
        await vscode.workspace.getConfiguration('etcdExplorer').update('etcdUrl', newUrl, vscode.ConfigurationTarget.Global);
        vscode.window.showInformationMessage(`Updated etcd URL to: ${newUrl}`);
        etcdTreeProvider.fetchAllKeys(); // Refresh the keys after updating the URL
    }
});


  context.subscriptions.push(
    refreshCommand,
    searchKeysCommand,
    showDetailsCommand,
    addKeyCommand,
    updateUrlCommand
  );
}
