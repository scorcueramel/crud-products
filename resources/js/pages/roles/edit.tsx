import RoleForm from "@/components/roles/role-form";
import { index } from "@/routes/roles";
import type { EditableRole, PermissionOption } from "@/types/role-managements";
import { Head } from "@inertiajs/react";

interface Props {
    role: EditableRole;
    permissions: PermissionOption[];
}

export default function EditRole({ role, permissions }: Props) {
    return (
        <>
            <Head title="Editar tol" />
            <div className="space-y-6 p-6">
                <h1 className="text-2xl font-bold">Editar rol: {role.name}</h1>
                <RoleForm role={role} permissions={permissions} />
            </div>
        </>
    );
}

EditRole.layout = {
    breadcrumbs: [
        { title: "Roles", href: index().url },
        { title: "Editar rol", href: "#" },
    ],
};
