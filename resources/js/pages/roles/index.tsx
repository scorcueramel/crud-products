import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import type { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { create, destroy, edit, index } from "@/routes/roles";
import type { PaginatedRoles, RoleItem } from "@/types/role-managements";

interface Props {
    roles: PaginatedRoles;
    filters: {
        search: string;
    };
    canCreate: boolean;
    flash: {
        success: string | null;
    };
}

export default function RolesIndex({
    roles,
    filters,
    canCreate,
    flash,
}: Props) {
    const [search, setSearch] = useState(filters.search);
    const [roleToDelete, setRoleToDelete] = useState<RoleItem | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    function submitSearch(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        router.get(
            index().url,
            search.trim() ? { search: search.trim() } : {},
            {
                preserveState: true,
                replace: true,
            },
        );
    }
    function confirmDelete() {
        if (!roleToDelete || deleting) return;
        setDeleting(true);
        setDeleteError(null);
        router.delete(destroy(roleToDelete.id).url, {
            preserveScroll: true,
            onSuccess: () => {
                setRoleToDelete(null);
            },
            onError: (errors) => {
                setDeleteError(errors.role ?? "No se puedo eliminar el rol.");
            },
            onFinish: () => {
                setDeleting(false);
            },
        });
    }

    return (
        <>
            <Head title="Roles y permisos" />
            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between gap-4">
                    <h1 className="text-2xl font-bold">Roles y permisos</h1>
                    {canCreate && (
                        <Button asChild>
                            <Link href={create().url}>Nuevo rol</Link>
                        </Button>
                    )}
                </div>
                {flash?.success && (
                    <div
                        role="status"
                        className="rounded-md border p-3 text-sm"
                    >
                        {flash.success}
                    </div>
                )}
                <form onSubmit={submitSearch} className="flex max-w-lg gap-2">
                    <Input
                        placeholder="Buscar rol..."
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        maxLength={100}
                    />
                    <Button type="submit">Buscar</Button>
                </form>
                <div className="overflow-x-auto rounded-md border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted">
                            <tr className="border-b text-left">
                                <th className="p-3">Rol</th>
                                <th className="p-3">Permisos</th>
                                <th className="p-3">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {roles.data.map((role) => (
                                <tr key={role.id} className="border-b">
                                    <td className="p-3 font-medium">
                                        {role.name}
                                    </td>
                                    <td className="p-3">
                                        <div className="flex max-w-xl flex-wrap gap-1">
                                            {role.permissions.length === 0 ? (
                                                <span className="text-muted-foreground">
                                                    Sin permisos
                                                </span>
                                            ) : (
                                                role.permissions.map(
                                                    (permission) => (
                                                        <span
                                                            key={permission}
                                                            className="rounded-md bg-muted px-2 py-1 text-xs"
                                                        >
                                                            {permission}
                                                        </span>
                                                    ),
                                                )
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-3">
                                        <div className="flex gap-2">
                                            {role.can_update && (
                                                <Button
                                                    asChild
                                                    size="sm"
                                                    variant="outline"
                                                >
                                                    <Link
                                                        href={edit(role.id).url}
                                                    >
                                                        Editar
                                                    </Link>
                                                </Button>
                                            )}
                                            {role.can_delete && (
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => {
                                                        setDeleteError(null);
                                                        setRoleToDelete(role);
                                                    }}
                                                >
                                                    Eliminar
                                                </Button>
                                            )}
                                            {!role.can_update &&
                                                !role.can_delete && (
                                                    <span className="text-xs text-muted-foreground">
                                                        Protegido
                                                    </span>
                                                )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {roles.data.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="p-6 text-center">
                                        No de encontraron roles.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="flex items-center justify-between gap-4">
                    <span className="text-sm text-muted-foreground">
                        Página {roles.current_page} de {roles.last_page} -{" "}
                        {roles.total} roles
                    </span>
                    <div className="flex gap-2">
                        {roles.prev_page_url && (
                            <Button asChild variant="outline" size="sm">
                                <Link href={roles.prev_page_url}>Anterior</Link>
                            </Button>
                        )}
                        {roles.next_page_url && (
                            <Button asChild variant="outline" size="sm">
                                <Link href={roles.next_page_url}>
                                    Siguiente
                                </Link>
                            </Button>
                        )}
                    </div>
                </div>
            </div>
            <Dialog
                open={roleToDelete !== null}
                onOpenChange={(open) => {
                    if (!open && !deleting) {
                        setRoleToDelete(null);
                        setDeleteError(null);
                    }
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>¿Eliminar rol?</DialogTitle>
                        <DialogDescription>
                            ¿Estás seguro de eliminar el rol{" "}
                            <strong>{roleToDelete?.name}</strong>? Esta acción
                            no se puede deshacer.
                        </DialogDescription>
                    </DialogHeader>
                    {deleteError && (
                        <p role="alert" className="text-sm text-destructive">
                            {deleteError}
                        </p>
                    )}
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            disabled={deleting}
                            onClick={() => setRoleToDelete(null)}
                            className="cursor-pointer"
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            disabled={deleting}
                            onClick={confirmDelete}
                            className="cursor-pointer"
                        >
                            {deleting ? "Eliminando..." : "Eliminar rol"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

RolesIndex.layout = {
    breadcrumbs: [
        {
            title: "Roles",
            href: index().url,
        },
    ],
};
