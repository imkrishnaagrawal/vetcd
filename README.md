# ETCD Explorer - VSCode Extension

ETCD Explorer is a Visual Studio Code extension that allows users to interact with an etcd cluster directly from the VSCode editor. You can view, search, and manage etcd keys and values seamlessly from a dedicated side panel.

## Features

- **View ETCD Keys:** Display all keys stored in your etcd instance in a tree view.
- **Search Keys:** Filter keys by substring using the search functionality in the side panel.
- **Add Key-Value Pairs:** Easily add new keys and values to the etcd store using the "+" button in the side panel.
- **View Key Details:** View the value associated with a specific key directly in VSCode. If the key is already open, it will refresh the same tab rather than opening new ones.
- **Configurable ETCD URL:** Set custom etcd cluster URLs to interact with different environments.

## How to Use

### 1. View Keys
Once the extension is activated, you will see a new **ETCD Explorer** section in the side panel. Click on the arrow to view all keys from your etcd instance.

### 2. Search Keys
You can filter keys by typing a substring into the search input field located at the top of the ETCD Explorer panel. This will dynamically update the displayed keys.

### 3. Add a Key-Value Pair
Click the "+" button next to the search input to add a new key-value pair to your etcd instance. A prompt will appear for entering both the key and value.

### 4. View Key Value
Click on any key in the tree view to display its value. The value will be shown in a VSCode editor tab. If the key has already been opened, the existing tab will be refreshed.

### 5. Refresh the Tree View
To refresh the list of keys, click the refresh icon at the top of the ETCD Explorer side panel.

### 6. Configure ETCD URL
You can supply a custom etcd URL using the extension's configuration options.

## Extension Settings

To configure the etcd URL:

1. Open VSCode settings (`File > Preferences > Settings`).
2. Search for "ETCD URL".
3. Enter the desired etcd URL (e.g., `http://localhost:2379`).

## Commands

This extension provides several commands that can be accessed via the command palette (`Ctrl + Shift + P`):

- **ETCD: Refresh Tree** - Refreshes the displayed list of keys.
- **ETCD: Search Keys** - Opens a search box to filter keys by a substring.
- **ETCD: Add Key** - Prompts the user to enter a new key-value pair for etcd.
- **ETCD: Show Details** - Opens the value of the selected key in an editor tab.

## Installation

1. Install the extension from the [VSCode Marketplace](https://marketplace.visualstudio.com/).
2. Configure the etcd URL via the settings as needed.
3. Enjoy managing your etcd instance directly from VSCode!

## Requirements

- Visual Studio Code 1.50.0 or later
- An accessible etcd cluster (local or remote)

## Contributing

We welcome contributions! If you have suggestions or find bugs, please open an issue or submit a pull request on our [GitHub repository](https://github.com/imkrishnaagrawal/vetcd).

