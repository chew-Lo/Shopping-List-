// This is the UI maanager

const UIManager = {
    elements: {},

    init() {
        this.elements = {
            welcomeScreen: document.getElementById('welcomeScreen'),
            listScreen: document.getElementById('listScreen'),
            createListBtn: document.getElementById('createListBtn'),
            joinListBtn: document.getElementById('joinListBtn'),
            joinListInput: document.getElementById('joinListInput'),
            leaveListBtn: document.getElementById('leaveListBtn'),
            currentListId: document.getElementById('currentListId'),
            copyIdBtn: document.getElementById('copyIdBtn'),
            itemInput: document.getElementById('itemInput'),
            addItemBtn: document.getElementById('addItemBtn'),
            shoppingList: document.getElementById('shoppingList'),
            clearCheckedBtn: document.getElementById('clearCheckedBtn'),
            clearAllBtn: document.getElementById('clearAllBtn'),
            totalItems: document.getElementById('totalItems'),
            checkedItems: document.getElementById('checkedItems'),
            toast: document.getElementById('toast')
        };
    },

    showWelcomeScreen() {
        this.elements.welcomeScreen.classList.remove('hidden');
        this.elements.listScreen.classList.add('hidden');
        this.elements.joinListInput.value = '';
    },

    showListScreen(listId) {
        this.elements.welcomeScreen.classList.add('hidden');
        this.elements.listScreen.classList.remove('hidden');
        this.elements.currentListId.textContent = listId;
        this.elements.itemInput.value = '';
    },

    renderItems(items) {
        this.elements.shoppingList.innerHTML = '';
        
        items.forEach(item => {
            const li = document.createElement('li');
            li.className = 'list-item' + (item.checked ? ' checked' : '');
            li.dataset.itemId = item.id;
            
            li.innerHTML = `
                <input type="checkbox" class="checkbox" ${item.checked ? 'checked' : ''}>
                <span class="item-text">${this.escapeHtml(item.text)}</span>
                <button class="delete-btn">Delete</button>
            `;
            
            this.elements.shoppingList.appendChild(li);
        });

        this.updateStats(items);
    },

    updateStats(items) {
        const total = items.length;
        const checked = items.filter(item => item.checked).length;
        
        this.elements.totalItems.textContent = `${total} item${total !== 1 ? 's' : ''}`;
        this.elements.checkedItems.textContent = `${checked} checked`;
    },

    showToast(message) {
        this.elements.toast.textContent = message;
        this.elements.toast.classList.remove('hidden');
        
        setTimeout(() => {
            this.elements.toast.classList.add('hidden');
        }, 3000);
    },

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    copyToClipboard(text) {
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(text);
                return true;
            }
            
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            const success = document.execCommand('copy');
            document.body.removeChild(textarea);
            return success;
        } catch (err) {
            console.error('Copy failed:', err);
            return false;
        }
    }
};