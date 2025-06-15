import { type RouteConfig, index, route } from "@react-router/dev/routes";

 

export default [index("routes/home.jsx") , route('about' , "pages/about.tsx") , route("signup" , "pages/Signup.tsx" ) , route("profilePage" , "pages/profilePage.tsx" ) , 
    route("settingsPage" , "pages/SettingsPage.tsx") , route("login" , "pages/LoginPage.tsx") 
] satisfies RouteConfig;
