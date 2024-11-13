import { NgModule } from "@angular/core";
import { imports } from "./app-imports.module";
import { providers } from "./app-provides.module";
import { AppComponent } from "./app.component";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports,
  providers,
  bootstrap: [AppComponent],
})
export class AppModule { }
