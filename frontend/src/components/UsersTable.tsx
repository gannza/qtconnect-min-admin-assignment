import { useEffect, useState } from "react";
import { useAppDispatch } from "../store/hooks";
import { deleteUser } from "../store/slices/userSlice";
import { User } from "../types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Edit, Trash2 } from "lucide-react";
import { toast } from "../hooks/useToast";

interface UsersTableProps {
  users: User[];
  onUserUpdated?: () => void;
  setEditingUser?: (user: User) => void;
}

const UsersTable = ({
  users,
  onUserUpdated,
  setEditingUser,
}: UsersTableProps) => {
  const dispatch = useAppDispatch();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [updatedUsers, setUpdatedUsers] = useState<User[]>(users);
  const handleDelete = async (user: User) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  useEffect(() => {
    setUpdatedUsers(users);
  }, [users]);

  const confirmDelete = async () => {
    if (userToDelete) {
      await dispatch(deleteUser(userToDelete.id));
      setDeleteDialogOpen(false);
      setUserToDelete(null);
      if (onUserUpdated) {
        onUserUpdated();
      }
      toast({
        title: "User deleted successfully",
        description: "User deleted successfully",
        variant: "success",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    return status === "active" ? (
      <Badge variant="default" className="bg-green-100 text-green-800">
        Active
      </Badge>
    ) : (
      <Badge variant="secondary" className="bg-gray-100 text-gray-800">
        Inactive
      </Badge>
    );
  };

  const getRoleBadge = (role: string) => {
    return role === "admin" ? (
      <Badge variant="destructive">Admin</Badge>
    ) : (
      <Badge variant="outline">User</Badge>
    );
  };
  const getEmailVerifiedBadge = (isValid: boolean) => {
    return isValid ? (
      <Badge className="bg-green-100 text-green-800">Verified</Badge>
    ) : (
      <Badge variant="destructive">Invalid</Badge>
    );
  };
  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {updatedUsers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-8 text-muted-foreground"
                >
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              updatedUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium pr-1">
                    <span className="mr-2">{user.email}</span>{" "}
                    {getEmailVerifiedBadge(user.isValid || false)}
                  </TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>

                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingUser && setEditingUser(user)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(user)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete user "{userToDelete?.email}"? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UsersTable;
