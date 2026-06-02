import {
AbstractControl,
ValidationErrors
}
from '@angular/forms';

export function adultValidator(
control:AbstractControl
):ValidationErrors|null{

const age=
Number(
control.value
);

if(
!control.value
){
return null;
}

return age>=18
?null
:{
adult:true
};

}