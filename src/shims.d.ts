import {Validation} from "@vuelidate/core";

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $v: Validation;
  }
}

export {}
