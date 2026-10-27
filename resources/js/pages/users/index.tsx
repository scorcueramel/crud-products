import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import type { FormEvent } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

import {
    create,
    destroy,
    edit,
    index,
} from '@/routes/users';

import type {
    PaginatedUsers,
    UserItem,
    UserPermissions,
} from '@/types/user-management';

interface Props {
    users: PaginatedUsers;
    filters: {
        search: string;
    };
    permissions: UserPermissions;
    authUserId: number;
    flash: {
        success: string | null;
    };
}

export default function UsersIndex({
    users,
    filters,
    permissions,
    authUserId,
    flash,
}: Props) {
    const [search, setSearch] = useState(filters.search);

    const [userToDelete, setUserToDelete] =
        useState<UserItem | null>(null);

    const [deleting, setDeleting] = useState(false);

    const [deleteError, setDeleteError] =
        useState<string | null>(null);

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
        if (!userToDelete || deleting) return;

        setDeleting(true);
        setDeleteError(null);

        router.delete(destroy(userToDelete.id).url, {
            preserveScroll: true,

            onSuccess: () => {
                setUserToDelete(null);
            },

            onError: (errors) => {
                setDeleteError(
                    errors.user ?? 'No se pudo eliminar el usuario.',
                );
            },

            onFinish: () => {
                setDeleting(false);
            },
        });
    }

    return (
        <>
            <Head title="Usuarios" />

            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between gap-4">
                    <h1 className="text-2xl font-bold">
                        Usuarios
                    </h1>

                    {permissions.create && (
                        <Button asChild>
                            <Link href={create().url}>
                                Nuevo usuario
                            </Link>
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

                <form
                    onSubmit={submitSearch}
                    className="flex max-w-lg gap-2"
                >
                    <Input
                        placeholder="Buscar nombre o correo..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        maxLength={100}
                    />

                    <Button type="submit">
                        Buscar
                    </Button>
                </form>

                <div className="overflow-x-auto rounded-md border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted">
                            <tr className="border-b text-left">
                                <th className="p-3">Nombre</th>
                                <th className="p-3">Correo</th>
                                <th className="p-3">Roles</th>
                                <th className="p-3">Estado</th>
                                <th className="p-3">Acciones</th>
                            </tr>
                        </thead>

                        <tbody>
                            {users.data.map((user) => (
                                <tr
                                    key={user.id}
                                    className="border-b"
                                >
                                    <td className="p-3">
                                        {user.name}
                                    </td>

                                    <td className="p-3">
                                        {user.email}
                                    </td>

                                    <td className="p-3">
                                        {user.roles.length > 0
                                            ? user.roles
                                                  .map((role) => role.name)
                                                  .join(', ')
                                            : 'Sin roles'}
                                    </td>

                                    <td className="p-3">
                                        {user.email_verified_at
                                            ? 'Verificado'
                                            : 'Pendiente'}
                                    </td>

                                    <td className="space-x-2 p-3">
                                        {permissions.update && (
                                            <Button
                                                asChild
                                                size="sm"
                                                variant="outline"
                                            >
                                                <Link
                                                    href={edit(user.id).url}
                                                >
                                                    Editar
                                                </Link>
                                            </Button>
                                        )}

                                        {permissions.delete &&
                                            user.id !== authUserId && (
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => {
                                                        setDeleteError(null);
                                                        setUserToDelete(user);
                                                    }}
                                                >
                                                    Eliminar
                                                </Button>
                                            )}
                                    </td>
                                </tr>
                            ))}

                            {users.data.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="p-6 text-center"
                                    >
                                        No se encontraron usuarios.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="flex items-center justify-between gap-4">
                    <span className="text-sm text-muted-foreground">
                        Página {users.current_page} de{' '}
                        {users.last_page} — {users.total} usuarios
                    </span>

                    <div className="flex gap-2">
                        {users.prev_page_url && (
                            <Button asChild size="sm" variant="outline">
                                <Link href={users.prev_page_url}>
                                    Anterior
                                </Link>
                            </Button>
                        )}

                        {users.next_page_url && (
                            <Button asChild size="sm" variant="outline">
                                <Link href={users.next_page_url}>
                                    Siguiente
                                </Link>
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            <Dialog
                open={userToDelete !== null}
                onOpenChange={(open) => {
                    if (!open && !deleting) {
                        setUserToDelete(null);
                        setDeleteError(null);
                    }
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            ¿Eliminar usuario?
                        </DialogTitle>

                        <DialogDescription>
                            ¿Estás seguro de eliminar a{' '}
                            <strong>{userToDelete?.name}</strong>?
                            Esta acción no se puede deshacer.
                        </DialogDescription>
                    </DialogHeader>

                    {deleteError && (
                        <p
                            role="alert"
                            className="text-sm text-destructive"
                        >
                            {deleteError}
                        </p>
                    )}

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            disabled={deleting}
                            onClick={() => setUserToDelete(null)}
                        >
                            Cancelar
                        </Button>

                        <Button
                            type="button"
                            variant="destructive"
                            disabled={deleting}
                            onClick={confirmDelete}
                        >
                            {deleting
                                ? 'Eliminando...'
                                : 'Eliminar usuario'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

UsersIndex.layout = {
    breadcrumbs: [{ title: "Usuarios", href: index().url }],
};
