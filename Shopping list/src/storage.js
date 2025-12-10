// This is the storage manager that uses localStorage

const StorageManager = {
    generateListId() {
        return Math.random().toString(36).substr(2, 9);
    },

    createList() {
        try {
            const listId = this.generateListId();
            const listData = {
                id: listId,
                items: [],
                createdAt: Date.now()
            };
            
            localStorage.setItem(listId, JSON.stringify(listData));
            return listId;
        } catch (error) {
            console.error('Error creating list:', error);
            return null;
        }
    },

    getList(listId) {
        try {
            const data = localStorage.getItem(listId);
            if (data) {
                return JSON.parse(data);
            }
            return null;
        } catch (error) {
            console.error('Error getting list:', error);
            return null;
        }
    },

    saveList(listId, items) {
        try {
            const listData = this.getList(listId);
            if (!listData) {
                return false;
            }
            
            listData.items = items;
            listData.updatedAt = Date.now();
            
            localStorage.setItem(listId, JSON.stringify(listData));
            return true;
        } catch (error) {
            console.error('Error saving list:', error);
            return false;
        }
    },

    addItem(listId, itemText) {
        const listData = this.getList(listId);
        if (!listData) return false;

        const newItem = {
            id: 'item_' + Math.random().toString(36).substr(2, 9),
            text: itemText,
            checked: false,
            createdAt: Date.now()
        };

        listData.items.push(newItem);
        return this.saveList(listId, listData.items);
    },

    removeItem(listId, itemId) {
        const listData = this.getList(listId);
        if (!listData) return false;

        listData.items = listData.items.filter(item => item.id !== itemId);
        return this.saveList(listId, listData.items);
    },

    toggleItem(listId, itemId) {
        const listData = this.getList(listId);
        if (!listData) return false;

        const item = listData.items.find(item => item.id === itemId);
        if (item) {
            item.checked = !item.checked;
            return this.saveList(listId, listData.items);
        }
        return false;
    },

    clearChecked(listId) {
        const listData = this.getList(listId);
        if (!listData) return false;

        listData.items = listData.items.filter(item => !item.checked);
        return this.saveList(listId, listData.items);
    },

    clearAll(listId) {
        return this.saveList(listId, []);
    },

    isValidListId(listId) {
        return typeof listId === 'string' && listId.startsWith('list_') && listId.length > 6;
    }
};