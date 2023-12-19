import Profile from "../components/admin/Profile";
import Dashboard from "../components/admin/Dashboard";
import Category from "../components/admin/Category";
import ViewCategory from "../components/admin/ViewCategory";
import EditCategory from "../components/admin/EditCategory";
import AddBook from "../components/admin/AddBook";
import ViewBooks from "../components/admin/ViewBooks";
import EditBook from "../components/admin/EditBook";




const routes = [
    { path : '/', exact:true , name: 'Admin'},
    { path : '/dashboard', exact:true , name: 'Dashboard', component : Dashboard},
    { path : '/profile' , exact:true , name: 'Profile', component : Profile},
    { path : '/add-category' , exact:true , name: 'Category', component : Category},
    { path : '/view-category' , exact:true , name: 'Viewcategory', component : ViewCategory},
    { path : '/edit-category/:id' , exact:true , name: 'Editcategory', component : EditCategory},
    { path : '/edit-book/:id' , exact:true , name: 'Editbook', component : EditBook},
    { path : '/add-book' , exact:true , name: 'AddBook', component : AddBook},
    { path : '/view-books' , exact:true , name: 'ViewBooks', component : ViewBooks},
];

export default routes;
