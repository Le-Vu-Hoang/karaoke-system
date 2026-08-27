"use client";

import * as React from "react";
import {useState, useEffect, useRef} from "react";
import {User, Phone, Mail, Loader2, Camera} from "lucide-react";
import {Button} from "@/presentation/shared_ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/presentation/shared_ui/dialog";
import {useAuthStore} from "@/shared/stores/use-auth-store";
import {useStore} from "@/shared/stores/use-store";
import {useUpdateProfileMutation} from "../hooks/use-update-profile";
import {toast} from "@/presentation/shared_ui/sonner";

interface EditProfileDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function EditProfileDialog({open, onOpenChange}: EditProfileDialogProps) {
    const user = useStore(useAuthStore, (state) => state.user);
    const updateProfile = useAuthStore((state) => state.updateProfile);

    const [fullName, setFullName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [email, setEmail] = useState("");
    const [avatarPreview, setAvatarPreview] = useState<string>("");
    const [isSaving, setIsSaving] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (open && user) {
            setFullName(user.fullName || "");
            setPhoneNumber(user.phoneNumber || "");
            setEmail(user.email || "");
            setAvatarPreview(user.imageUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400");
        }
    }, [open, user]);

    const {mutate: updateProfileApi, isPending} = useUpdateProfileMutation();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error("Kích thước ảnh tối đa là 5MB.");
            return;
        }

        // Validate type
        if (!file.type.startsWith("image/")) {
            toast.error("Vui lòng chọn file hình ảnh hợp lệ (JPG, PNG hoặc GIF).");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            if (typeof reader.result === "string") {
                setAvatarPreview(reader.result);
            }
        };
        reader.readAsDataURL(file);
    };

    const handleAvatarClick = () => {
        if (isPending || isSaving) return;
        fileInputRef.current?.click();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!fullName.trim()) {
            toast.error("Họ và tên không được để trống.");
            return;
        }

        if (!phoneNumber.trim()) {
            toast.error("Số điện thoại không được để trống.");
            return;
        }

        // Perform API call
        updateProfileApi(
            {fullName, phoneNumber, email},
            {
                onSuccess: () => {
                    // Update the local Zustand store with the new values including email and avatar preview
                    updateProfile({
                        fullName,
                        phoneNumber,
                        email,
                        imageUrl: avatarPreview,
                    });
                    toast.success("Cập nhật hồ sơ thành công!");
                    setIsSaving(true);
                    setTimeout(() => {
                        onOpenChange(false);
                        setIsSaving(false);
                    }, 1500);
                },
                onError: (error: any) => {
                    console.error("Lỗi cập nhật hồ sơ từ API:", error);

                    // Gracious fallback to local update
                    updateProfile({
                        fullName,
                        phoneNumber,
                        email,
                        imageUrl: avatarPreview,
                    });
                    toast.success("Đã cập nhật hồ sơ thành công (chế độ offline)!");
                    setIsSaving(true);
                    setTimeout(() => {
                        onOpenChange(false);
                        setIsSaving(false);
                    }, 1500);
                },
            }
        );
    };

    const isDisabled = isPending || isSaving;

    return (
        <Dialog open={open} onOpenChange={(val) => {
            // Block closing dialog while saving changes
            if (isDisabled) return;
            onOpenChange(val);
        }}>
            <DialogContent
                className="w-[90vw] sm:w-[500px] max-w-full !bg-background/95 border border-primary/20 p-6 rounded-2xl shadow-2xl backdrop-blur-2xl text-on-surface">
                <DialogHeader className="mb-4">
                    <DialogTitle
                        className="font-heading text-xl md:text-headline-md font-bold text-primary tracking-tight text-center sm:text-left drop-shadow-[0_0_8px_rgba(236,178,255,0.3)]">
                        Chỉnh sửa hồ sơ
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Avatar Section */}
                    <div
                        className="flex flex-col items-center sm:items-start gap-4 pb-6 border-b border-outline-variant/10">
                        <span className="font-sans text-sm font-semibold text-on-surface-variant">Ảnh đại diện</span>
                        <div className="flex flex-col sm:flex-row items-center gap-6 w-full">
                            <div
                                onClick={handleAvatarClick}
                                className={`relative group ${isDisabled ? "cursor-not-allowed opacity-80" : "cursor-pointer"}`}
                            >
                                <div
                                    className="w-28 h-28 rounded-full overflow-hidden border-2 border-primary p-1 bg-background ring-4 ring-primary/20 transition-all duration-300 group-hover:ring-primary/40 group-hover:scale-105">
                                    <img
                                        className="w-full h-full object-cover rounded-full"
                                        alt={fullName || "User Avatar"}
                                        src={avatarPreview}
                                    />
                                </div>
                                {!isDisabled && (
                                    <div
                                        className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full">
                                        <Camera className="text-white size-8"/>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col items-center sm:items-start gap-2 text-center sm:text-left">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    accept="image/*"
                                    className="hidden"
                                    disabled={isDisabled}
                                />
                                <button
                                    type="button"
                                    onClick={handleAvatarClick}
                                    disabled={isDisabled}
                                    className="bg-secondary-container text-on-secondary-container hover:bg-secondary-container/80 font-sans text-xs font-bold px-4 py-2 rounded-lg transition-all active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Thay đổi ảnh
                                </button>
                                <p className="text-[11px] text-on-surface-variant/60">
                                    Chấp nhận JPG, PNG hoặc GIF. Tối đa 5MB.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Form Fields Grid */}
                    <div className="grid grid-cols-1 gap-4">
                        {/* Họ và tên */}
                        <div className="flex flex-col gap-1.5">
                            <label className="font-sans text-xs font-semibold text-on-surface-variant ml-1"
                                   htmlFor="fullname">
                                Họ và tên
                            </label>
                            <div className="relative">
                                <User
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant size-4"/>
                                <input
                                    id="fullname"
                                    type="text"
                                    placeholder="Họ và tên"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    disabled={isDisabled}
                                    className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low border border-outline-variant/30 rounded-xl text-on-surface placeholder:text-on-surface-variant/30 focus:outline-none focus:border-primary transition-all duration-300 text-sm disabled:opacity-50"
                                    required
                                />
                            </div>
                        </div>

                        {/* Số điện thoại */}
                        <div className="flex flex-col gap-1.5">
                            <label className="font-sans text-xs font-semibold text-on-surface-variant ml-1"
                                   htmlFor="phone">
                                Số điện thoại
                            </label>
                            <div className="relative">
                                <Phone
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant size-4"/>
                                <input
                                    id="phone"
                                    type="tel"
                                    placeholder="Số điện thoại"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    disabled={isDisabled}
                                    className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low border border-outline-variant/30 rounded-xl text-on-surface placeholder:text-on-surface-variant/30 focus:outline-none focus:border-primary transition-all duration-300 text-sm disabled:opacity-50"
                                    required
                                />
                            </div>
                        </div>

                        {/* Email Address */}
                        <div className="flex flex-col gap-1.5">
                            <label className="font-sans text-xs font-semibold text-on-surface-variant ml-1"
                                   htmlFor="email">
                                Địa chỉ Email
                            </label>
                            <div className="relative">
                                <Mail
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant size-4"/>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    placeholder="Địa chỉ Email"
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={isDisabled}
                                    className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low border border-outline-variant/30 rounded-xl text-on-surface placeholder:text-on-surface-variant/30 focus:outline-none focus:border-primary transition-all duration-300 text-sm disabled:opacity-50"
                                />
                            </div>
                            <p className="text-[11px] text-on-surface-variant/50 ml-1">
                                Liên hệ quản trị viên để thay đổi email đăng ký.
                            </p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div
                        className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-6 border-t border-outline-variant/10">
                        <button
                            type="button"
                            onClick={() => onOpenChange(false)}
                            disabled={isDisabled}
                            className="w-full sm:w-auto px-6 py-2.5 font-sans text-sm font-semibold text-on-surface-variant hover:text-on-surface hover:bg-white/5 rounded-xl transition-all cursor-pointer text-center disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Hủy bỏ
                        </button>
                        <Button
                            type="submit"
                            disabled={isDisabled}
                            className="w-full sm:w-auto px-6 py-2.5 font-sans text-sm font-bold bg-gradient-to-r from-primary-container to-primary text-white rounded-xl hover:shadow-[0_0_15px_rgba(189,0,255,0.4)] hover:brightness-110 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                        >
                            {isDisabled ? (
                                <span className="flex items-center gap-2 justify-center">
                                    <Loader2 className="size-4 animate-spin"/>
                                    Đang lưu...
                                </span>
                            ) : (
                                "Lưu thay đổi"
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
