import { Component } from '@angular/core';

import { AnimationController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  constructor(
    private animationCtrl: AnimationController
  ) {}


  myCustomPageTransition = ((baseEl: any, opts?: any) => {
      console.log('opts.enteringEl:'  + opts.enteringEl); //Entering Element - New Page
      console.log('opts.leavingEl:'  + opts.leavingEl);   //Leaving Element - Current Page
      const anim1 = this.animationCtrl.create()
        .addElement(opts.leavingEl)
        .duration(600)
        .iterations(1)
        .easing('ease-out')
        .fromTo('transform', 'translateX(0px)', 'translateX(100%)')
        .fromTo('opacity', '1', '0.2');
      let anim2 = this.animationCtrl.create()
        .addElement(opts.enteringEl)
        .duration(600)
        .iterations(1)
        .easing('ease-out')
        .fromTo('opacity', '0.0', '1');
        anim2 = this.animationCtrl.create()
        .duration(600)
        .iterations(1)
        .addAnimation([anim1, anim2]);
      return anim2;
  });
}
