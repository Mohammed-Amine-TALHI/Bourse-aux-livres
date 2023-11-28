import Profile from "../components/admin/Profile";
import Dashboard from "../components/admin/Dashboard";


const routes = [
    { path : '/', exact:true , name: 'Admin'},
    { path : '/dashboard', exact:true , name: 'Dashboard', component : Dashboard},
    { path : '/profile' , exact:true , name: 'Profile', component : Profile},
];

export default routes;
