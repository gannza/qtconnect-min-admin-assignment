import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User, UserFormData, UserStats, ChartData } from '../../types/index';
import { userApi } from '../api/userApi';
import { hashEmail, signHash, initializeCryptoKeys } from '../../utils/crypto';

interface UserState {
  users: User[];
  userStats: UserStats;
  chartData: ChartData[];
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [],
  userStats: { total: 0, active: 0, inactive: 0, admins: 0, regular: 0 },
  chartData: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async () => {
    const response = await userApi.getUsers();
    return response.data;
  }
);

export const createUser = createAsyncThunk(
  'users/createUser',
  async (userData: UserFormData) => {
    // Initialize crypto keys if not already done
    const keys = initializeCryptoKeys();
    
    // Hash the email
    const emailHash = hashEmail(userData.email);
    
    // Sign the hash
    const signature = signHash(emailHash, keys.privateKey);
    
    // Add crypto data to user data
    const userWithCrypto = {
      ...userData,
      emailHash,
      signature,
    };
    
    const response = await userApi.createUser(userWithCrypto);
    return response.data;
  }
);

export const updateUser = createAsyncThunk(
  'users/updateUser',
  async ({ id, userData }: { id: string; userData: UserFormData }) => {
    const response = await userApi.updateUser(id, userData);
    return response.data;
  }
);

export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (id: string) => {
    await userApi.deleteUser(id);
    return id;
  }
);

export const fetchUserStats = createAsyncThunk(
  'users/fetchUserStats',
  async () => {
    const response = await userApi.getUserStats();
    return response.data;
  }
);

export const fetchChartData = createAsyncThunk(
  'users/fetchChartData',
  async (days: number = 7) => {
    const response = await userApi.getChartData(days);
    return response.data;
  }
);


export const exportUsers = createAsyncThunk(
  'users/exportUsers',
  async () => {
    const uint8Array = await userApi.exportUsers();
    // Decode protobuf data to users
    const { decodeProtobufToUsers } = await import('../../utils/protobuf');
    const users = await decodeProtobufToUsers(uint8Array);
    return users;
  }
);

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setUsers: (state, action: PayloadAction<User[]>) => {
      state.users = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch users';
      })
      // Create user
      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users.push(action.payload);
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create user';
      })
      // Update user
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.users.findIndex(user => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update user';
      })
      // Delete user
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter(user => user.id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete user';
      })
      // Fetch user stats
      .addCase(fetchUserStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserStats.fulfilled, (state, action) => {
        state.loading = false;
        state.userStats = action.payload;
      })
      .addCase(fetchUserStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch user stats';
      })
      // Fetch chart data
      .addCase(fetchChartData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChartData.fulfilled, (state, action) => {
        state.loading = false;
        state.chartData = action.payload;
      })
      .addCase(fetchChartData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch chart data';
      })
      // Export users
      .addCase(exportUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(exportUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(exportUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to export users';
      });
  },
});

export const { clearError, setUsers } = userSlice.actions;
export default userSlice.reducer;
