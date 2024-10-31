import { useSelector } from "react-redux";
import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOut,
} from "../../../../redux/user/userSlice";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast , Toaster} from "sonner";

export default function Profile() {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({});
  const [isDeletePopoverOpen, setIsDeletePopoverOpen] = useState(false);

  const { currentUser, loading, error } = useSelector((state) => {
    if (state && state.user) {
      return state.user;
    }
    return { currentUser: null, loading: false, error: null };
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      toast.error("No current user found");
      return;
    }

    const loadingToast = toast.loading("Updating profile...");

    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success === false) {
        dispatch(updateUserFailure(data));
        toast.dismiss(loadingToast);
        toast.error(data.message || "Failed to update profile");
        return;
      }

      dispatch(updateUserSuccess(data));
      toast.dismiss(loadingToast);
      toast.success("Profile updated successfully!", {
        description: "Your changes have been saved.",
      });

      if (formData.password) {
        const passwordInput = document.getElementById("password");
        if (passwordInput) passwordInput.value = "";
      }
    } catch (error) {
      dispatch(updateUserFailure(error));
      toast.dismiss(loadingToast);
      toast.error("An error occurred while updating your profile", {
        description: error instanceof Error ? error.message : "Please try again later",
      });
    }
  };

  const handleDeleteAccount = async () => {
    if (!currentUser) {
      toast.error("No current user found");
      return;
    }

    const loadingToast = toast.loading("Deleting account...");

    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.success === false) {
        dispatch(deleteUserFailure(data));
        toast.dismiss(loadingToast);
        toast.error(data.message || "Failed to delete account");
        return;
      }

      dispatch(deleteUserSuccess(data));
      setIsDeletePopoverOpen(false);
      toast.dismiss(loadingToast);
      toast.success("Account deleted successfully", {
        description: "We're sorry to see you go!",
      });
    } catch (error) {
      dispatch(deleteUserFailure(error));
      toast.dismiss(loadingToast);
      toast.error("An error occurred while deleting your account", {
        description: error instanceof Error ? error.message : "Please try again later",
      });
    }
  };

  const handleSignOut = async () => {
    const loadingToast = toast.loading("Signing out...");

    try {
      await fetch("/api/auth/signout");
      dispatch(signOut());
      toast.dismiss(loadingToast);
      toast.success("Signed out successfully");
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Failed to sign out", {
        description: "Please try again",
      });
      console.error(error);
    }
  };

  if (!currentUser) {
    return (
      <Card className="max-w-lg mx-auto">
        <CardContent>
          <Alert>
            <AlertDescription>
              No user data available. Please sign in.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-lg mx-auto">
            <Toaster position="bottom-right" richColors />

      <CardHeader>
        <CardTitle className="text-3xl font-semibold text-center">
          Profile
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            defaultValue={currentUser.username}
            type="text"
            id="username"
            placeholder="Username"
            className="bg-slate-100 rounded-lg p-3"
            onChange={handleChange}
          />
          <Input
            defaultValue={currentUser.email}
            type="email"
            id="email"
            placeholder="Email"
            className="bg-slate-100 rounded-lg p-3"
            onChange={handleChange}
          />
          <Input
            type="password"
            id="password"
            placeholder="Password"
            className="bg-slate-100 rounded-lg p-3"
            onChange={handleChange}
          />
          <Button disabled={loading} className="w-full">
            {loading ? "Updating..." : "Update"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Popover
          open={isDeletePopoverOpen}
          onOpenChange={setIsDeletePopoverOpen}
        >
          <PopoverTrigger asChild>
            <Button variant="destructive" className="cursor-pointer">
              Delete Account
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Confirm Deletion</h4>
                <p className="text-sm text-muted-foreground">
                  Are you sure you want to delete your account? This action
                  cannot be undone.
                </p>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsDeletePopoverOpen(false)}
                >
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDeleteAccount}>
                  Delete
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        <Button
          variant="secondary"
          onClick={handleSignOut}
          className="cursor-pointer"
        >
          Sign out
        </Button>
      </CardFooter>
      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </Card>
  );
}
