import { CommonModule } from '@angular/common';
import { ChangeDetectorRef,Component, OnInit } from '@angular/core';
import { ProjectResourceService } from '../../../services/project-resource/project-resource.service';
import { FormsModule } from '@angular/forms';
import { NgZorroAntdModule } from '../../../ng-zorro-antd.module';
import { SearchPipe } from '../../../Searchpipe/search.pipe';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { NzCustomColumn } from 'ng-zorro-antd/table';
import {
  checkResponseSuccess,
  handleCatchException,
} from '../../../utils/Uitls';
import { NzMessageService } from 'ng-zorro-antd/message';


interface CustomColumn extends NzCustomColumn {
  name: string;
  required?: boolean;
  position?: 'left' | 'right';
  key: string;
}


@Component({
  selector: 'app-project-resource',
  standalone: true,
  imports: [CommonModule, SearchPipe, FormsModule, NgZorroAntdModule],
  templateUrl: './project-resource.component.html',
  styleUrl: './project-resource.component.css',
})


export class ProjectResourceComponent implements OnInit {
  searchText = "";
  isVisible: boolean = false;
  footer: CustomColumn[] = [];
  displayedColumns: CustomColumn[] = [];
  hiddenColumns: CustomColumn[] = [];
  loadingTable: boolean = false;
  listOfData: any = [];
  listViewRef: any = [];
  defaultVisibleColumns = ['domain', 'homepage', 'affiliate_page','email','contact_page'];

  customColumn: CustomColumn[] = [
    {
      name: 'Domain',
      value: 'domain',
      default: true,
      required: true,
      position: 'left',
      width: 100,
      fixWidth: true,
      key: 'domain',
    },
    {
      name: 'Home page',
      value: 'homepage',
      default: true,
      width: 200,
      key: 'homepage'
    },
    {
      name: 'Affiliate page',
      value: 'affiliate_page',
      default: true,
      width: 200,
      key: 'affiliate_page'
    },

    {
      name: 'Email',
      value: 'email',
      default: true,
      width: 200,
      key: 'email'
    },
    {
      name: 'Contact page',
      value: 'contact_page',
      default: true,
      width: 200,
      key: 'contact_page'
    },
    {
      name: 'Organization linkedin',
      value: 'organization_linkedin',
      default: true,
      width: 200,
      key: 'organization_linkedin'
    },
    {
      name: 'Organization twitter',
      value: 'organization_twitter',
      default: true,
      width: 200,
      key: 'organization_twitter'
    },
    {
      name: 'Language',
      value: 'language',
      default: true,
      width: 200,
      key: 'language'
    },
    {
      name: 'Trust flow',
      value: 'trust_flow',
      default: true,
      width: 200,
      key: 'trust_flow'
    },
    {
      name: 'Citation flow',
      value: 'citation_flow',
      default: true,
      width: 200,
      key: 'citation_flow'
    },
    {
      name: 'Commission',
      value: 'commission',
      default: true,
      width: 200,
      key: 'commission'
    },
    {
      name: 'Recurring',
      value: 'recurring',
      default: true,
      width: 200,
      key: 'recurring'
    },
    {
      name: 'Lifetime',
      value: 'lifetime',
      default: true,
      width: 200,
      key: 'lifetime'
    },
    {
      name: 'Cookie duration',
      value: 'cookie_duration',
      default: true,
      width: 200,
      key: 'cookie_duration'
    },
    {
      name: 'Software',
      value: 'software',
      default: true,
      width: 200,
      key: 'software'
    },
    {
      name: 'Meta description',
      value: 'meta_description',
      default: true,
      width: 200,
      key: 'meta_description'
    },
  ];

  constructor(private projectResourceService: ProjectResourceService,private cdr: ChangeDetectorRef,private msg: NzMessageService,) {}

  ngOnInit(): void {
    this.getData();
    this.footer = this.customColumn.filter(item => item.position === 'right' && item.required);
    this.displayedColumns = this.customColumn.filter(item =>
    this.defaultVisibleColumns.includes(item.key));
    this.hiddenColumns = this.customColumn.filter(item =>
     !this.defaultVisibleColumns.includes(item.key) && !item.required
   );
}
async getData()
{
    this.loadingTable = true;
    try{
     const res = await this.projectResourceService.getGoogleSheetValue().toPromise();
     this.listOfData = res?.data;
     this.listViewRef = [...this.listOfData];
    }catch (error) {
     handleCatchException(
       error,
       this.msg,
       'Something went wrong'
     );
     console.error(error);
   } finally {
     this.loadingTable = false;
   }
}
reloadData() {
 this.getData();
}
showModal(): void {
 this.isVisible = true;
}

drop(event: CdkDragDrop<CustomColumn[]>): void {
 if (event.previousContainer === event.container) {
   moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
 } else {
   transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
 }

 this.displayedColumns = this.displayedColumns.map(item => {
   item.default = true;
   return item;
 });
 this.hiddenColumns = this.hiddenColumns.map(item => {
   item.default = false;
   return item;
 });

 this.cdr.markForCheck();
}

deleteCustom(value: CustomColumn, index: number): void {
 value.default = false;
 this.hiddenColumns = [...this.hiddenColumns, value];
 this.displayedColumns.splice(index, 1);
 this.cdr.markForCheck();
}

addCustom(value: CustomColumn, index: number): void {
 value.default = true;
 this.displayedColumns = [...this.displayedColumns, value];
 this.hiddenColumns.splice(index, 1);
 this.cdr.markForCheck();
}

handleOk(): void {
 this.customColumn = [...this.displayedColumns, ...this.hiddenColumns, ...this.footer];
 this.isVisible = false;
 this.cdr.markForCheck();
}

handleCancel(): void {
 this.isVisible = false;
}
}
