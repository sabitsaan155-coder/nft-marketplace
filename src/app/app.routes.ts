import { Routes } from '@angular/router';
import { Catalog } from './components/catalog/catalog';
import { Detail } from './components/detail/detail';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { Create } from './components/create/create';
import { Profile } from './components/profile/profile';
import { MyNfts } from './components/my-nfts/my-nfts';

export const routes: Routes = [
  { path: '', redirectTo: 'catalog', pathMatch: 'full' }, // Главная страница сразу кидает в каталог
  { path: 'catalog', component: Catalog },
  { path: 'nft/:id', component: Detail }, // Страница деталей NFT с динамическим ID
  { path: 'login', component: Login },    // Теперь всё исправлено!
  { path: 'register', component: Register },
  { path: 'create', component: Create },
  { path: 'my-nfts', component: MyNfts },
  { path: 'profile', component: Profile },
  { path: '**', redirectTo: 'catalog' } // Если юзер ввёл бред — возвращаем в каталог
];