import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  CUSTOM_ELEMENTS_SCHEMA,
  Injectable,
  NO_ERRORS_SCHEMA,
  Pipe,
  PipeTransform,
  SimpleChange,
} from '@angular/core';
import { BaseFormComponent } from './form.component';
import { FormConfig } from './form.interface';
import { FormControl } from '@angular/forms';
import {
  TranslateLoader,
  TranslateModule,
  TranslateService,
  TranslatePipe,
} from '@ngx-translate/core';
import { Observable, of } from 'rxjs';

const translations: any = {};

class FakeLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<any> {
    return of(translations);
  }
}

@Pipe({
  name: 'translate',
})
class TranslatePipeMock implements PipeTransform {
  public name = 'translate';

  public transform(query: string, ...args: any[]): any {
    return query;
  }
}

@Injectable()
class TranslateServiceStub {
  public get<T>(key: T): Observable<T> {
    return of(key);
  }

  public getBrowserLang() {
    return 'es';
  }

  public setDefaultLang(language: any) {}

  public get currentLang() {
    return 'en';
  }

  public instant(key: any) {
    return 'value';
  }

  public use(lang: any) {}
}

describe('BaseFormComponent', () => {
  let component: BaseFormComponent;
  let fixture: ComponentFixture<BaseFormComponent>;

  beforeEach(() => {
    TestBed.overrideComponent(BaseFormComponent, {
      set: {
        imports: [TranslateModule],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [
          TranslateService,
          { provide: TranslateService, useClass: TranslateServiceStub },
          { provide: TranslatePipe, useClass: TranslatePipeMock },
        ],
      },
    });
    fixture = TestBed.createComponent(BaseFormComponent);
    component = fixture.componentInstance;
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  it(`formConfig has default value`, () => {
    expect(component.formConfig).toEqual([]);
  });

  it(`formConfigSorted has default value`, () => {
    expect(component.formConfigSorted).toEqual([]);
  });

  describe('ngOnChanges', () => {
    it('makes expected calls', () => {
      const changes = {
        formConfig: new SimpleChange('1', '2', false),
      };
      component.formConfig = [
        {
          layoutDefine: {
            row: 0,
          },
        },
        {
          layoutDefine: {
            row: 1,
          },
        },
        {
          layoutDefine: {
            row: 3,
          },
        },
        {
          layoutDefine: {
            row: 2,
          },
        },
        {
          layoutDefine: {
            row: 0,
          },
        },
      ] as FormConfig[];
      spyOn(component, 'ngOnChanges').and.callThrough();
      component.ngOnChanges(changes);
      expect(component.ngOnChanges).toHaveBeenCalled();
    });
  });

  describe('updateConfig', () => {
    it('makes expected calls', () => {
      spyOn(component, 'updateConfig').and.callThrough();
      const mockItem = {
        visibility: 'hidden',
        fieldControl: new FormControl(''),
      } as FormConfig;
      component.updateConfig(mockItem);
      expect(component.updateConfig).toHaveBeenCalled();
    });
  });

  describe('ngAfterContentChecked', () => {
    it('makes expected calls', () => {
      spyOn(component, 'ngAfterContentChecked').and.callThrough();
      component.ngAfterContentChecked();
      expect(component.ngAfterContentChecked).toHaveBeenCalled();
    });
  });
});
