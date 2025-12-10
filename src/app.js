// This is the main application controller

const App = {
    currentListId: null,

    init() {
        UIManager.init();
        this.setupEventListeners();
    },

    setupEventListeners() {
        UIManager.elements.createListBtn.addEventListener('click', () => this.createNewList());
        UIManager.elements.joinListBtn.addEventListener('click', () => this.joinList());
        UIManager.elements.joinListInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.joinList();
        });

        UIManager.elements.leaveListBtn.addEventListener('click', () => this.leaveList());
        UIManager.elements.copyIdBtn.addEventListener('click', () => this.copyListId());
        UIManager.elements.addItemBtn.addEventListener('click', () => this.addItem());
        UIManager.elements.itemInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addItem();
        });
        UIManager.elements.clearCheckedBtn.addEventListener('click', () => this.clearChecked());
        UIManager.elements.clearAllBtn.addEventListener('click', () => this.clearAll());

        UIManager.elements.shoppingList.addEventListener('click', (e) => {
            const listItem = e.target.closest('.list-item');
            if (!listItem) return;

            const itemId = listItem.dataset.itemId;

            if (e.target.classList.contains('checkbox')) {
                this.toggleItem(itemId);
            } else if (e.target.classList.contains('delete-btn')) {
                this.deleteItem(itemId);
            }
        });
    },

    createNewList() {
        UIManager.elements.createListBtn.disabled = true;
        UIManager.elements.createListBtn.textContent = 'Creating...';

        const listId = StorageManager.createList();
        
        if (listId) {
            this.currentListId = listId;
            UIManager.showListScreen(listId);
            UIManager.showToast('List created successfully!');
            this.loadList();
        } else {
            UIManager.showToast('Failed to create list. Please try again.');
        }

        UIManager.elements.createListBtn.disabled = false;
        UIManager.elements.createListBtn.textContent = 'Create New List';
    },

    joinList() {
        const listId = UIManager.elements.joinListInput.value.trim();
        
        if (!listId) {
            UIManager.showToast('Please enter a list ID');
            return;
        }

        if (!StorageManager.isValidListId(listId)) {
            UIManager.showToast('Invalid list ID format');
            return;
        }

        UIManager.elements.joinListBtn.disabled = true;
        UIManager.elements.joinListBtn.textContent = 'Joining...';

        const listData = StorageManager.getList(listId);
        
        if (listData) {
            this.currentListId = listId;
            UIManager.showListScreen(listId);
            UIManager.showToast('Joined list successfully!');
            this.loadList();
        } else {
            UIManager.showToast('List not found. Please check the ID.');
        }

        UIManager.elements.joinListBtn.disabled = false;
        UIManager.elements.joinListBtn.textContent = 'Join List';
    },

    leaveList() {
        this.currentListId = null;
        UIManager.showWelcomeScreen();
    },

    copyListId() {
        const success = UIManager.copyToClipboard(this.currentListId);
        if (success) {
            UIManager.showToast('List ID copied to clipboard!');
        } else {
            UIManager.showToast('Failed to copy. Please copy manually.');
        }
    },

    loadList() {
        if (!this.currentListId) return;

        const listData = StorageManager.getList(this.currentListId);
        if (listData) {
            UIManager.renderItems(listData.items);
        }
    },

    addItem() {
        const itemText = UIManager.elements.itemInput.value.trim();
        
        if (!itemText) {
            UIManager.showToast('Please enter an item');
            return;
        }

        const success = StorageManager.addItem(this.currentListId, itemText);
        
        if (success) {
            UIManager.elements.itemInput.value = '';
            this.loadList();
        } else {
            UIManager.showToast('Failed to add item');
        }
    },

    deleteItem(itemId) {
        const success = StorageManager.removeItem(this.currentListId, itemId);
        
        if (success) {
            this.loadList();
        } else {
            UIManager.showToast('Failed to delete item');
        }
    },

    toggleItem(itemId) {
        const success = StorageManager.toggleItem(this.currentListId, itemId);
        
        if (success) {
            this.loadList();
        } else {
            UIManager.showToast('Failed to update item');
        }
    },

    clearChecked() {
        const listData = StorageManager.getList(this.currentListId);
        const checkedCount = listData.items.filter(item => item.checked).length;
        
        if (checkedCount === 0) {
            UIManager.showToast('No checked items to clear');
            return;
        }

        if (confirm(`Clear ${checkedCount} checked item${checkedCount !== 1 ? 's' : ''}?`)) {
            const success = StorageManager.clearChecked(this.currentListId);
            
            if (success) {
                this.loadList();
                UIManager.showToast('Checked items cleared');
            } else {
                UIManager.showToast('Failed to clear items');
            }
        }
    },

    clearAll() {
        const listData = StorageManager.getList(this.currentListId);
        
        if (listData.items.length === 0) {
            UIManager.showToast('List is already empty');
            return;
        }

        if (confirm('Clear all items from the list?')) {
            const success = StorageManager.clearAll(this.currentListId);
            
            if (success) {
                this.loadList();
                UIManager.showToast('All items cleared');
            } else {
                UIManager.showToast('Failed to clear list');
            }
        }
    }
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => App.init());
} else {
    App.init();
}