<template>
    <header>
      <div class="flex items-center gap-2 w-full px-0">
        <BackButton />
        <Button severity="info" disabled class="flex-1">Firestore CRUD</Button>
      </div>
    </header>
    <!-- Toolbar -->
    <div class="flex justify-between items-center my-4">
      <h3 class="text-xl font-semibold">Users</h3>
      <Button @click="openNew" severity="success">
        <i class="pi pi-plus mr-2"></i>
        Add User
      </Button>
    </div>

    <!-- DataTable -->
    <DataTable
      v-model:selection="selectedUser"
      :value="users"
      dataKey="id"
      :loading="loading"
      :paginator="true"
      :rows="10"
      :filters="filters"
      filterDisplay="menu"
      :globalFilterFields="['name', 'email', 'role']"
      responsiveLayout="scroll"
      class="p-datatable-compact p-datatable-sm"
    >
      <template #header>
        <div class="flex justify-between items-center">
          <span class="p-input-icon-right flex-grow">
            <InputText
              v-model="filters['global'].value"
              placeholder="Search..."
              class="w-1/3 mr-3"
            />
            <i class="pi pi-search" />
          </span>
        </div>
      </template>

      <!-- Table Columns -->
      <Column selectionMode="single" headerStyle="width: 3rem"></Column>

      <Column field="name" header="Name" sortable>
        <template #body="{ data }">
          {{ data.name }}
        </template>
      </Column>

      <Column field="email" header="Email" sortable>
        <template #body="{ data }">
          {{ data.email }}
        </template>
      </Column>

      <Column field="role" header="Role" sortable>
        <template #body="{ data }">
          <Tag :value="data.role" :severity="getRoleSeverity(data.role)" />
        </template>
      </Column>

      <Column field="createdAt" header="Created At" sortable>
        <template #body="{ data }">
          {{ formatTimestampString(data.createdAt) }}
        </template>
      </Column>

      <Column headerStyle="width: 8rem">
        <template #body="{ data }">
          <div class="flex gap-2">
            <Button @click="editUser(data)" icon="pi pi-pencil" severity="info" text rounded />
            <Button @click="confirmDelete(data)" icon="pi pi-trash" severity="danger" text rounded />
          </div>
        </template>
      </Column>
    </DataTable>

    <!-- User Dialog -->
    <Dialog
      v-model:visible="userDialog"
      :style="{ width: '450px' }"
      :header="dialogMode === 'create' ? 'Add User' : 'Edit User'"
      :modal="true"
      class="p-fluid"
    >
      <div class="field mt-4">
        <label for="name">Name</label>
        <InputText
          id="name"
          v-model.trim="user.name"
          :class="{ 'p-invalid': submitted && !user.name }"
          required
        />
        <small class="p-error" v-if="submitted && !user.name">Name is required.</small>
      </div>

      <div class="field mt-4">
        <label for="email">Email</label>
        <InputText
          id="email"
          v-model.trim="user.email"
          :class="{ 'p-invalid': submitted && !user.email }"
          required
        />
        <small class="p-error" v-if="submitted && !user.email">Email is required.</small>
      </div>

      <div class="field mt-4">
        <label for="role">Role</label>
        <Dropdown
          id="role"
          v-model="user.role"
          :options="roles"
          optionLabel="label"
          optionValue="value"
          placeholder="Select a Role"
          :class="{ 'p-invalid': submitted && !user.role }"
        />
        <small class="p-error" v-if="submitted && !user.role">Role is required.</small>
      </div>

      <template #footer>
        <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
        <Button label="Save" icon="pi pi-check" severity="success" @click="saveUser" />
      </template>
    </Dialog>

    <!-- Delete Confirmation -->
    <Dialog
      v-model:visible="deleteDialog"
      :style="{ width: '450px' }"
      header="Confirm"
      :modal="true"
    >
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
        <span v-if="user">Are you sure you want to delete <b>{{ user.name }}</b>?</span>
      </div>
      <template #footer>
        <Button label="No" icon="pi pi-times" text @click="deleteDialog = false" />
        <Button label="Yes" icon="pi pi-check" severity="danger" @click="deleteUser" />
      </template>
    </Dialog>

</template>

<script setup lang="ts">
import { FilterMatchMode } from 'primevue/api';
import { Timestamp } from 'firebase/firestore';
import Dialog from 'primevue/dialog';
import Dropdown from 'primevue/dropdown';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Tag from 'primevue/tag';

const { formatTimestampString } = useFirebase();
const { getCollection, setDocument, updateDocument, deleteDocument } = useFirestore();
const toast = useToast();

// State
const users = ref<any[]>([]);
const user = ref<any>({});
const selectedUser = ref();
const userDialog = ref(false);
const deleteDialog = ref(false);
const submitted = ref(false);
const loading = ref(false);
const dialogMode = ref<'create' | 'edit'>('create');

// Filters for DataTable
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

// Role options and styling
const roles = [
  { label: 'Admin', value: 'admin' },
  { label: 'User', value: 'user' },
  { label: 'Editor', value: 'editor' }
];

const getRoleSeverity = (role: string) => {
  switch (role) {
    case 'admin':
      return 'danger';
    case 'editor':
      return 'warning';
    case 'user':
      return 'success';
    default:
      return null;
  }
};

// Load users
const loadUsers = async () => {
  try {
    loading.value = true;
    users.value = await getCollection('users');
  } catch (error: any) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to load users',
      life: 3000
    });
  } finally {
    loading.value = false;
  }
};

// Open dialog for new user
const openNew = () => {
  user.value = {
    name: '',
    email: '',
    role: '',
    createdAt: Timestamp.now()
  };
  submitted.value = false;
  userDialog.value = true;
  dialogMode.value = 'create';
};

// Open dialog for editing user
const editUser = (data: any) => {
  user.value = { ...data };
  userDialog.value = true;
  dialogMode.value = 'edit';
};

// Hide dialog
const hideDialog = () => {
  userDialog.value = false;
  submitted.value = false;
};

// Save user (create or update)
const saveUser = async () => {
  submitted.value = true;

  if (!user.value.name || !user.value.email || !user.value.role) {
    return;
  }

  try {
    if (dialogMode.value === 'create') {
      await setDocument('users', '', user.value);
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'User created',
        life: 3000
      });
    } else {
      await updateDocument('users', user.value.id, user.value);
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'User updated',
        life: 3000
      });
    }

    userDialog.value = false;
    await loadUsers();
  } catch (error: any) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error.message,
      life: 3000
    });
  }
};

// Confirm delete
const confirmDelete = (data: any) => {
  user.value = data;
  deleteDialog.value = true;
};

// Delete user
const deleteUser = async () => {
  try {
    await deleteDocument('users', user.value.id);
    deleteDialog.value = false;
    user.value = {};
    await loadUsers();

    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'User deleted',
      life: 3000
    });
  } catch (error: any) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error.message,
      life: 3000
    });
  }
};

// Load users on mount
onMounted(() => {
  loadUsers();
});
</script>

<style scoped>
.p-datatable .p-datatable-tbody > tr > td {
  padding: 0.25rem;
  font-size: 0.875rem;
  font-weight: 400;
}

.p-datatable .p-datatable-thead > tr > th {
  padding: 0.25rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.p-datatable .p-column-header-content {
  font-size: 0.875rem;
}

.p-button.p-button-icon-only {
  width: 2rem;
  height: 2rem;
  padding: 0;
  border: none;
}

.p-button.p-button-icon-only .p-button-icon {
  font-size: 1rem;
}
</style>
