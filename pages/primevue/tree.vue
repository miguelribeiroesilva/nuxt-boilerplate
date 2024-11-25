<script setup lang="ts">
const nodes = ref([
    {
        key: '0',
        label: 'Documents',
        data: 'Documents Folder',
        icon: 'pi pi-fw pi-folder',
        children: [
            {
                key: '0-0',
                label: 'Work',
                data: 'Work Folder',
                icon: 'pi pi-fw pi-folder',
                children: [
                    { key: '0-0-0', label: 'Expenses.doc', icon: 'pi pi-fw pi-file', data: 'Expenses Document' },
                    { key: '0-0-1', label: 'Resume.doc', icon: 'pi pi-fw pi-file', data: 'Resume Document' }
                ]
            },
            {
                key: '0-1',
                label: 'Home',
                data: 'Home Folder',
                icon: 'pi pi-fw pi-folder',
                children: [
                    { key: '0-1-0', label: 'Invoices.txt', icon: 'pi pi-fw pi-file', data: 'Invoices for this month' }
                ]
            }
        ]
    },
    {
        key: '1',
        label: 'Events',
        data: 'Events Folder',
        icon: 'pi pi-fw pi-calendar',
        children: [
            { key: '1-0', label: 'Meeting', icon: 'pi pi-fw pi-calendar-plus', data: 'Meeting' },
            { key: '1-1', label: 'Product Launch', icon: 'pi pi-fw pi-calendar-plus', data: 'Product Launch' },
            { key: '1-2', label: 'Report Review', icon: 'pi pi-fw pi-calendar-plus', data: 'Report Review' }
        ]
    },
    {
        key: '2',
        label: 'Movies',
        data: 'Movies Folder',
        icon: 'pi pi-fw pi-star',
        children: [
            {
                key: '2-0',
                icon: 'pi pi-fw pi-star',
                label: 'Al Pacino',
                data: 'Pacino Movies',
                children: [
                    { key: '2-0-0', label: 'Scarface', icon: 'pi pi-fw pi-video', data: 'Scarface Movie' },
                    { key: '2-0-1', label: 'Serpico', icon: 'pi pi-fw pi-video', data: 'Serpico Movie' }
                ]
            },
            {
                key: '2-1',
                label: 'Robert De Niro',
                icon: 'pi pi-fw pi-star',
                data: 'De Niro Movies',
                children: [
                    { key: '2-1-0', label: 'Goodfellas', icon: 'pi pi-fw pi-video', data: 'Goodfellas Movie' },
                    { key: '2-1-1', label: 'Untouchables', icon: 'pi pi-fw pi-video', data: 'Untouchables Movie' }
                ]
            }
        ]
    }
]);

const selectedKey = ref<string | null>(null);
const expandedKeys = ref({});

const onNodeSelect = (node: any) => {
    console.log('Selected Node:', node);
};
</script>

<template>
    <div class="card">
        <h1 class="text-3xl font-bold mb-6">PrimeVue Tree Component</h1>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="flex flex-col">
                <h2 class="text-xl font-semibold mb-4">Interactive Tree</h2>
                <Tree
                    v-model:expandedKeys="expandedKeys"
                    v-model:selectionKeys="selectedKey"
                    :value="nodes"
                    selectionMode="single"
                    @node-select="onNodeSelect"
                    class="w-full md:w-80 bg-white dark:bg-slate-800 p-4 rounded-lg shadow"
                />
            </div>
            
            <div class="flex flex-col">
                <h2 class="text-xl font-semibold mb-4">Selected Node Info</h2>
                <div v-if="selectedKey" class="bg-white dark:bg-slate-800 p-4 rounded-lg shadow">
                    <p class="mb-2">
                        <span class="font-semibold">Selected Key:</span> {{ selectedKey }}
                    </p>
                </div>
                <div v-else class="bg-white dark:bg-slate-800 p-4 rounded-lg shadow">
                    <p class="text-gray-500">Select a node to see its information</p>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
:deep(.p-tree) {
    border: none;
}

:deep(.p-tree .p-tree-container .p-treenode) {
    padding: 0.25rem;
}

:deep(.p-tree .p-tree-container .p-treenode .p-treenode-content) {
    border-radius: 0.5rem;
    padding: 0.5rem;
}

:deep(.p-tree .p-tree-container .p-treenode .p-treenode-content:hover) {
    background: rgba(var(--primary-color-rgb), 0.1);
}

:deep(.p-tree .p-tree-container .p-treenode .p-treenode-content.p-highlight) {
    background: rgba(var(--primary-color-rgb), 0.2);
}

.dark :deep(.p-tree) {
    background: transparent;
    color: white;
}

.dark :deep(.p-tree .p-tree-container .p-treenode .p-treenode-content:hover) {
    background: rgba(255, 255, 255, 0.1);
}

.dark :deep(.p-tree .p-tree-container .p-treenode .p-treenode-content.p-highlight) {
    background: rgba(255, 255, 255, 0.2);
}
</style>
