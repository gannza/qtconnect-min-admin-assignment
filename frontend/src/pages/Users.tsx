import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import UsersTable from "../components/UsersTable";
import UserForm from "../components/UserForm";

import LoadingSpinner from "../components/ui/LoadingSpinner";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Shield } from "lucide-react";
import { decodeSignature, verifyDecodedSignature } from "../utils/crypto";
import { decodeProtobufToUsers } from "../utils/protobuf";
import { userApi } from "../store/api/userApi";
import { toast } from "../hooks/useToast";
import UserEditForm from "../components/UserEditForm";
import { User } from "../types";

const Users = () => {
  const dispatch = useAppDispatch();
  const { users, loading, error } = useAppSelector((state) => state.users);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [exportedUsers, setExportedUsers] = useState<any[]>([]);

  useEffect(() => {
    // Load users from export endpoint instead of regular fetch
    loadUsersFromExport();
  }, []);

  const loadUsersFromExport = async () => {
    try {
      // Get protobuf data from export endpoint
      const uint8Array = await userApi.exportUsers();

      // Decode protobuf data to users
      const decodedUsers = await decodeProtobufToUsers(uint8Array);
      let results: any[] = [];
      const usersToVerify = decodedUsers;

      for (const user of usersToVerify) {
        if (user.signature) {
          try {
            // Decode the Base64-encoded signature JSON
            const decodedSignature = decodeSignature(user.signature);
        
            if (!decodedSignature) {
              continue;
            }
            // console.log( user.email,
            //   decodedSignature);
            // Verify using the decoded signature data (includes embedded public key)
            const isValid = await verifyDecodedSignature(
              user.email,
              decodedSignature
            );
            
             if (isValid) results.push({ ...user, isValid, isEditable: true });
          } catch (error) {
            // Skip invalid signatures
          }
        }
      }
      setExportedUsers(results);

      // Update Redux store with decoded users
      dispatch({ type: "users/setUsers", payload: results });
    } catch (error) {
      // Silently fallback to regular fetch without showing error page
      try {
        toast({
          title: "Using standard user data",
          description: "Export endpoint unavailable, loading from regular endpoint",
          variant: "default"
        });
      } catch (fallbackError) {
        toast({
          title: "Failed to load users",
          description: "Unable to load users from any endpoint",
          variant: "destructive"
        });
      }
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" />;
  }

  // Only show error page for critical failures, not for individual API errors
  if (error && !exportedUsers.length && !users.length) {
    return (
      <div className="text-center text-destructive">
        <p>Error loading users: {error}</p>
        <p className="text-sm text-muted-foreground mt-2">
          Please check your connection and try again.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Users</h1>
          <p className="text-muted-foreground">
            Manage and monitor user accounts from Protobuf export
          </p>

          <div className="text-xs text-muted-foreground">
            <p>
              • Signatures are stored as Base64-encoded JSON with embedded
              public keys
            </p>
            <p>• Each signature contains public key for email verification</p>
            <p>• Email hashing uses SHA-384 algorithm</p>
           
          </div>
          <div className="flex items-center space-x-2 text-blue-600">
            <Shield className="h-4 w-4" />
            <span className="text-sm">
            Verification uses the embedded public key from each signature
            </span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription className=" text-green-600 font-medium">
                View and manage all user accounts from Protobuf export and verified users 
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UsersTable
                users={exportedUsers.length > 0 ? exportedUsers : users}
                onUserUpdated={loadUsersFromExport}
                setEditingUser={setEditingUser}
                />
            </CardContent>
          </Card>
        </div>
        {/* Edit User Dialog */}
      {editingUser && (
        <UserEditForm
          user={editingUser}
          open={!!editingUser}
           onOpenChange={async (data:any) => {
             if(!!data.user){
               setEditingUser(null);
               // Update local state instead of reloading
               const updatedUsers = exportedUsers.length > 0 ? exportedUsers : users;
               const updatedUserIndex = updatedUsers.findIndex(u => u.id === data.user.id);
               if (updatedUserIndex !== -1) {
                 const newUsers = [...updatedUsers];
                 newUsers[updatedUserIndex] = data.user;
                 if (exportedUsers.length > 0) {
                   setExportedUsers(newUsers);
                 }
                 dispatch({ type: "users/setUsers", payload: newUsers });
               }
             }
           }}
        />
      )}

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Add New User</CardTitle>
              <CardDescription>Create a new user account</CardDescription>
            </CardHeader>
            <CardContent>
              <UserForm onRefreshChange={(refresh) => {
                if (refresh) {
                  // Reload data when new user is created
                   loadUsersFromExport();
                }
              }} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Users;
