import { Outlet } from 'react-router-dom';
import EmployeeSidebar from './EmployeeSidebar';
import { SidebarTrigger } from '@/components/ui/sidebar';

const EmployeeLayout = () => {
  return (
    <div className="flex min-h-screen w-full">
      <EmployeeSidebar />
      <div className="flex-1 flex flex-col">
        <header className="h-14 border-b bg-card px-4 flex items-center">
          <SidebarTrigger />
          <h1 className="ml-4 text-lg font-semibold">GestorManutenção - Funcionário</h1>
        </header>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default EmployeeLayout;