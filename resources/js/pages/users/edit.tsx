import { Head } from "@inertiajs/react";

import UserForm from "@/components/users/user-form";
import { index } from "@/routes/users";

import type { EditableUser, Role } from "@/types/user-management";

interface Props {
    user: EditableUser;
    roles: Role[];
}

export default function EditUser({ user, roles }: Props) {
    return (
        <>
            <Head title="Editar usuario" />
            <div className="space-y-6 p-6">
                <h1 className="text-2xl font-bold">Editar usuario</h1>
                <UserForm user={user} roles={roles} />
            </div>
        </>
    );
}

EditUser.layout = {
    breadcrumbs: [
        {
            title: "Usuarios",
            href: index().url,
        },
        {
            title: "Editar usuario",
            href: "#",
        },
    ],
};
