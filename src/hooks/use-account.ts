import { api } from "convex/_generated/api";
import { useAction, useMutation, useQuery } from "convex/react";
import { toast } from "sonner";

export const useUpdateUser = () => {
	const updateUser = useMutation(api.account.updateUser);

	const mutateAsync = async (input: {
		name?: string;
		email?: string;
		picture?: string;
	}) => {
		try {
			const result = await updateUser(input);
			toast.success(result.message);
			return result;
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Failed to update user",
			);
			throw error;
		}
	};

	return {
		mutateAsync,
	};
};

export const useUploadImage = () => {
	const uploadImage = useMutation(api.account.uploadImage);

	const mutateAsync = async (input: { file: any }) => {
		try {
			const result = await uploadImage(input);
			toast.success("Profile picture updated successfully");
			return result;
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Failed to upload image",
			);
			throw error;
		}
	};

	return {
		mutateAsync,
	};
};

export const useResendVerificationEmail = () => {
	const resendEmail = useMutation(api.account.resendVerificationEmail);

	const mutateAsync = async () => {
		try {
			const result = await resendEmail({});
			toast.success(result.message);
			return result;
		} catch (error) {
			toast.error(
				error instanceof Error
					? error.message
					: "Failed to send verification email",
			);
			throw error;
		}
	};

	return {
		mutateAsync,
	};
};

export const useUpdatePassword = () => {
	const updatePassword = useMutation(api.account.updatePassword);

	const mutateAsync = async (input: {
		currentPassword: string;
		newPassword: string;
	}) => {
		try {
			const result = await updatePassword(input);
			toast.success(result.message);
			return result;
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Failed to update password",
			);
			throw error;
		}
	};

	return {
		mutateAsync,
	};
};

export const useDeleteAccount = () => {
	const deleteAccount = useMutation(api.account.deleteAccount);

	const mutateAsync = async (input: { confirmText: string }) => {
		try {
			const result = await deleteAccount(input);
			toast.success(result.message);
			return result;
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Failed to delete account",
			);
			throw error;
		}
	};

	return {
		mutateAsync,
	};
};

export const useSetup2FA = () => {
	const setup2FA = useAction(api.accountActions.setup2FA);

	const mutateAsync = async () => {
		try {
			const result = await setup2FA({});
			return result;
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Failed to setup 2FA",
			);
			throw error;
		}
	};

	return {
		mutateAsync,
	};
};

export const useEnable2FA = () => {
	const enable2FA = useAction(api.accountActions.enable2FA);

	const mutateAsync = async (input: { code: string }) => {
		try {
			const result = await enable2FA(input);
			toast.success(result.message);
			return result;
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Failed to enable 2FA",
			);
			throw error;
		}
	};

	return {
		mutateAsync,
	};
};

export const useDisable2FA = () => {
	const disable2FA = useMutation(api.account.disable2FA);

	const mutateAsync = async () => {
		try {
			const result = await disable2FA({});
			toast.success(result.message);
			return result;
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Failed to disable 2FA",
			);
			throw error;
		}
	};

	return {
		mutateAsync,
	};
};

export const useGet2FAStatus = () => {
	return useQuery(api.account.get2FAStatus);
};

export const useGetUserAccounts = () => {
	return useQuery(api.account.getUserAccounts);
};

export const useIsOAuthUser = () => {
	const accounts = useQuery(api.account.getUserAccounts);

	// Check if user has OAuth accounts (GitHub or Google)
	const isOAuthUser =
		Array.isArray(accounts) &&
		accounts.some(
			(account) =>
				account.providerId === "github" || account.providerId === "google",
		);

	return isOAuthUser;
};
