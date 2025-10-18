import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User, UserFormData, UserStats, ChartData } from '../../types/index';
import { userApi } from '../api/userApi';

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
export const createUser = createAsyncThunk(
  'users/createUser',
  async (userData: UserFormData, { rejectWithValue }) => {
    try {
      const response = await userApi.createUser(userData);
      return response.data;
    } catch (error: any) {
      // Handle 409 and other validation errors
      if (error.status === 409 || error.response?.status === 409) {
        const errorData = error.data || error.response?.data;
        return rejectWithValue(error || errorData);
      }
      return rejectWithValue(error.message || error || 'An error occurred');
    }
  }
);

export const updateUser = createAsyncThunk(
  'users/updateUser',
  async ({ id, userData }: { id: string; userData: UserFormData }, { rejectWithValue }) => {
    try {
      const response = await userApi.updateUser(id, userData);
      return response.data;
    } catch (error: any) {
      // Handle 409 and other validation errors
      if (error.status === 409 || error.response?.status === 409) {
        const errorData = error.data || error.response?.data;
        return rejectWithValue(error || errorData);
      }
      return rejectWithValue(error.message || error || 'An error occurred');
    }
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
      // Create user
      .addCase(createUser.pending, (state) => {
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.users.push(action.payload);
      })
      .addCase(createUser.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to create user';
      })
      // Update user
      .addCase(updateUser.pending, (state) => {
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.users.findIndex(user => user.id === action.payload.id);
        if (index !== -1) {
          action.payload.isValid=true;
          state.users[index] = action.payload;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
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
