import { Routes } from '@angular/router';
import { LoginComponent } from './routes/auth/login/login.component';
import { HomeComponent } from './routes/home/home.component';
import { DashboardComponent } from './routes/home/dashboard/dashboard.component';
import { RegisterComponent } from './routes/auth/register/register.component';
import { RefComponent } from './routes/home/ref/ref.component';
import { ProjectComponent } from './routes/home/project/project.component';
import { authGuard } from './shared/auth/auth.guard';
import { TutorialComponent } from './routes/home/tutorial/tutorial.component';
import { RegisterSuccessfullyComponent } from './routes/auth/register-successfully/register-successfully.component';
import { TransactionHistoryComponent } from './routes/home/transaction-history/transaction-history.component';
import { AffiliateProgramComponent } from './routes/home/affiliate-program/affiliate-program.component';
import { roleGuard } from './shared/auth/role.guard';
import { Role } from './shared/auth/auth.service';
import { UnauthorizedComponent } from './routes/auth/unauthorized/unauthorized.component';
import { BootcampTrainingComponent } from './routes/home/bootcamp-training/bootcamp-training.component';
import { RedirectComponent } from './routes/home/redirect/redirect.component';
import { ProjectResourceComponent } from './routes/home/project-resource/project-resource.component';
import { AdsMarketComponent } from './routes/home/ads-market/ads-market.component';
import { InvoiceStoreComponent } from './routes/home/invoice-store/invoice-store.component';
import { TrafficProofComponent } from './routes/home/traffic-proof/traffic-proof.component';
import { OtcServicesComponent } from './routes/home/otc-services/otc-services.component';
import { TopUpComponent } from './routes/home/top-up/top-up.component';
import { MyAdsOfferComponent } from './routes/home/my-ads-offer/my-ads-offer.component';
import { DealTicketListComponent } from './routes/home/deal-ticket-list/deal-ticket-list.component';
import { CampaignComponent } from './routes/home/campaign/campaign.component';
import { VerifiedComponent } from './routes/auth/verified/verified.component';
import { CreateCommunityComponent } from './routes/forum/create-community/create-community.component';
import { MaintenanceComponent } from './routes/notification/maintenance/maintenance.component';
import { ForumComponent } from './routes/forum/forum.component';
import { CommunityInsideComponent } from './routes/forum/community-inside/community-inside.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/home/dashboard',
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'register-successfully', component: RegisterSuccessfullyComponent },
  { path: 'unauthorized', component: UnauthorizedComponent },
  { path: 'verified', component: VerifiedComponent },
  { path: 'maintenance', component: MaintenanceComponent },
  {
    path: 'create-community', component: CreateCommunityComponent, canActivate: [authGuard], data: {
      role: [
        Role.Admin,
        Role.ProUser,
        Role.PremiumUser,
        Role.UnlimitedUser,
        Role.TrialUser,
        Role.AffiliateUser,
      ],
    },
  },
  {
    path: 'forum',
    component: ForumComponent,
    canActivate: [authGuard],
    data: {
      role: [Role.Admin, Role.ProUser, Role.PremiumUser, Role.UnlimitedUser, Role.TrialUser, Role.AffiliateUser],
    },
    children: [
      {
        path: 'community/:id',
        component: CommunityInsideComponent,
        // canActivate: [roleGuard],
        data: {
          role: [Role.Admin, Role.ProUser, Role.PremiumUser, Role.UnlimitedUser, Role.TrialUser, Role.AffiliateUser],
        },
      },]
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'bootcamp-training',
        component: BootcampTrainingComponent,
        // canActivate: [roleGuard],
        data: {
          role: [Role.Admin, Role.ProUser, Role.PremiumUser],
        },
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [roleGuard],
        data: {
          role: [
            Role.Admin,
            Role.ProUser,
            Role.PremiumUser,
            Role.UnlimitedUser,
            Role.TrialUser,
            Role.AffiliateUser,
          ],
        },
      },
      {
        path: 'ref',
        component: RefComponent,
        canActivate: [roleGuard],
        data: {
          role: [
            Role.Admin,
            Role.ProUser,
            Role.PremiumUser,
            Role.UnlimitedUser,
            Role.TrialUser,
            Role.AffiliateUser,
          ],
        },
      },
      {
        path: 'project',
        component: ProjectComponent,
        canActivate: [roleGuard],
        data: {
          role: [
            Role.Admin,
            Role.ProUser,
            Role.PremiumUser,
            Role.UnlimitedUser,
            Role.TrialUser,
            Role.AffiliateUser,
          ],
        },
      },
      {
        path: 'campaign',
        component: CampaignComponent,
        canActivate: [roleGuard],
        data: {
          role: [
            Role.Admin,
            Role.ProUser,
            Role.PremiumUser,
            Role.UnlimitedUser,
            Role.TrialUser,
            Role.AffiliateUser,
          ],
        },
      },
      {
        path: 'redirect',
        component: RedirectComponent,
        canActivate: [roleGuard],
        data: {
          role: [
            Role.Admin,
            Role.ProUser,
            Role.PremiumUser,
            Role.UnlimitedUser,
          ],
        },
      },
      {
        path: 'transaction-history',
        component: TransactionHistoryComponent,
        canActivate: [roleGuard],
        data: {
          role: [
            Role.Admin,
            Role.ProUser,
            Role.PremiumUser,
            Role.UnlimitedUser,
          ],
        },
      },
      {
        path: 'tutorial',
        component: TutorialComponent,
        // canActivate: [roleGuard],
        data: {
          role: [
            Role.Admin,
            Role.ProUser,
            Role.PremiumUser,
            Role.UnlimitedUser,
            Role.TrialUser,
            Role.AffiliateUser,
          ],
        },
      },
      {
        path: 'affiliate-program',
        component: AffiliateProgramComponent,
        canActivate: [roleGuard],
        data: {
          role: [
            Role.Admin,
            Role.ProUser,
            Role.PremiumUser,
            Role.UnlimitedUser,
            Role.AffiliateUser,
            Role.TrialUser,
          ],
        },
      },
      {
        path: 'project-list',
        component: ProjectResourceComponent,
        canActivate: [roleGuard],
        data: {
          role: [
            Role.Admin,
            Role.ProUser,
            Role.PremiumUser,
            Role.UnlimitedUser,
            Role.AffiliateUser,
            Role.TrialUser,
          ],
        },
      },
      {
        path: 'ads-market',
        component: AdsMarketComponent,
        canActivate: [roleGuard],
        data: {
          role: [
            Role.Admin,
            Role.ProUser,
            Role.PremiumUser,
            Role.UnlimitedUser,
            Role.AffiliateUser,
            Role.TrialUser,
          ],
        },
      },
      {
        path: 'my-ads-offer',
        component: MyAdsOfferComponent,
        canActivate: [roleGuard],
        data: {
          role: [
            Role.Admin,
            Role.ProUser,
            Role.PremiumUser,
            Role.UnlimitedUser,
            Role.AffiliateUser,
            Role.TrialUser,
          ],
        },
      },
      {
        path: 'deal-ticket-list',
        component: DealTicketListComponent,
        canActivate: [roleGuard],
        data: {
          role: [
            Role.Admin,
            Role.ProUser,
            Role.PremiumUser,
            Role.UnlimitedUser,
            Role.AffiliateUser,
            Role.TrialUser,
          ],
        },
      },
      {
        path: 'invoice-store',
        component: InvoiceStoreComponent,
        canActivate: [roleGuard],
        data: {
          role: [
            Role.Admin,
            Role.ProUser,
            Role.PremiumUser,
            Role.UnlimitedUser,
            Role.AffiliateUser,
            Role.TrialUser,
          ],
        },
      },
      {
        path: 'traffic-proof',
        component: TrafficProofComponent,
        canActivate: [roleGuard],
        data: {
          role: [
            Role.Admin,
            Role.ProUser,
            Role.PremiumUser,
            Role.UnlimitedUser,
            Role.AffiliateUser,
            Role.TrialUser,
          ],
        },
      },
      {
        path: 'otc-services',
        component: OtcServicesComponent,
        canActivate: [roleGuard],
        data: {
          role: [
            Role.Admin,
            Role.ProUser,
            Role.PremiumUser,
            Role.UnlimitedUser,
            Role.AffiliateUser,
            Role.TrialUser,
          ],
        },
      },
      {
        path: 'top-up',
        component: TopUpComponent,
        canActivate: [roleGuard],
        data: {
          role: [
            Role.Admin,
            Role.ProUser,
            Role.PremiumUser,
            Role.UnlimitedUser,
            Role.AffiliateUser,
            Role.TrialUser,
          ],
        },
      },
      // { path: 'daily-task', component: DailyTaskScreenComponent },
    ],
  },
];
