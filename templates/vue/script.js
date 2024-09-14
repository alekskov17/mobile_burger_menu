(function (window){
   'use strict';

   if (window.JSKraytVueMenuBurger)
      return;
   let validatePhone;

   window.JSKraytVueMenuBurger = function (params_def)
   {
      BX.BitrixVue.createApp({
         data: {
            tree:[],
            treeMain:[],
            currentMenu:[],
            currentMenuSelectID:0,
            arrHistory:[],
            open:false,
            backButton:'',
            authLink:'',
            loader:false,
            subMenu:false,
            htmlDopMenu:"",
            htmlActionMenu:"",
            personalUrl:"",
            contacts:{},
            panels:[],
            showpanel:true,
         },
         mounted() {
            this.backButton = params_def.K_BACK;
            this.authLink = params_def.K_AUTH;
            this.htmlDopMenu = params_def.HTML_DOP_MENU;
            this.htmlActionMenu = params_def.HTML_ACTION_MENU;
            this.personalUrl = params_def.PERSONAL_PAGE_URL;
            if(window['citySelect'])
            {
               let c = BX.clone(window['citySelect'].cityObj);
               let cs = Object.entries(c).map((item) => {
                  return item[1]
               });
               this.contacts =  cs.map((item) => {
                  item.show = false
                  item.h = 0
                  return item
               })
            }
         },
         computed: {
            arMenuCurrent:function ()
            {
               return  this.tree[this.currentMenuSelectID]
            },
            getIdback()
            {
               return this.arrHistory.findIndex((item) => item == this.currentMenuSelectID)
            },
            isPanel: function (){
              return this.panels.length > 0
            }
         },
         methods: {
            bodyNoScroll: function() {
               let body = document.getElementsByTagName('body')[0];
               body.classList.add('noscroll');
            },
            bodyScroll: function() {
               let body = document.getElementsByTagName('body')[0];
               body.classList.remove('noscroll');
            },
            getTreeSections()
            {
               this.loader = true;
               var reloadCaptchaRequest = BX.ajax.runComponentAction('krayt:krayt.mobile.burger', 'getMenuTree', {
                  mode: 'class',
                  signedParameters: params_def.signedParameters
               });
               reloadCaptchaRequest.then((response) => {
                  let res = BX.parseJSON(response);
                  if(res.data.section_tree)
                  {
                     this.tree = res.data.section_tree;
                     this.treeMain = this.tree[0];
                  }
                  setTimeout(()=>{
                     this.loader = false;
                  },500)
               });
            },
            openChild(s){
               this.subMenu = false
               this.currentMenuSelectID = s.ID;
               this.arrHistory.push(this.currentMenuSelectID);
               this.panels.push({
                  show:false,
                  items:this.arMenuCurrent
               });
               this.showpanel = false;
               setTimeout(()=>{
                  this.subMenu = true
                  this.panels[this.panels.length - 1].show = true;
               },100)
            },
            back()
            {
               this.subMenu = false
               let index = this.getIdback;
               if(index > 0)
               {
                  let idPrev = this.arrHistory[index - 1]
                  this.arrHistory.splice(index,1);
                  this.currentMenuSelectID = BX.clone(idPrev);
               }else{
                  this.open = false;
                  this.bodyScroll();
               }
               this.showpanel = true;
               this.panels[this.panels.length - 1].show = false;
               setTimeout(()=>{
                  let l = this.panels.length - 1;
                  this.panels.splice(l,1);
               },300)

            },
            openMenu()
            {
                this.subMenu = true

                if(this.tree.length == 0 )
                this.getTreeSections();

                this.arrHistory.push(this.currentMenuSelectID);
                this.open = true;
                this.bodyNoScroll();
            },
            closeMenu(){
               this.open = false;
               this.bodyScroll();
            },
            openContact(c,event){

               let elm = this.$refs['list_'+c.ID][0];
               if(c.h == 0 )
               {
                  c.h = elm.scrollHeight;
               }
               if(c.show){
                  if(elm)
                  {
                     elm.style.height = "0px"
                  }
                  c.show = false;
               }
               else{
                  if(elm)
                  {
                     elm.style.height = c.h+"px"
                  }
                  c.show = true;
               }

            },
         },
         template: `
            <div>
               <div>
                   <a @click="openMenu" href="javascript:void(0);" class="burger-btn">
                      <span></span>
                      <span></span>
                      <span></span>
                   </a>
               </div>
               <div :class="{open:open, 'loader-shine':loader}" class="mobile-menu-wrp" @click.self="closeMenu">          
                 <div class="mobile-menu" v-bind:class="{customScroll : !isPanel}">
                 <div class="shine-wrp">
                    <div class="shine">
                    </div>
                 </div>
                    <div class="burger-menu-head">
                       <a @click="back" class="burger-menu-back" href="javascript:void(0);">
                          <svg width="7" height="10" viewBox="0 0 7 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6.24259 9.24264L1.99995 5L6.24259 0.757359" stroke-width="2"/>
                           </svg>
                           {{ backButton }}
                       </a>
                       
                       <a :href="personalUrl" class="burger-menu-auth">
                         <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                           <path fill-rule="evenodd" clip-rule="evenodd" d="M10.0001 2.49998C8.61937 2.49998 7.50008 3.61927 7.50008 4.99998C7.50008 6.38069 8.61937 7.49998 10.0001 7.49998C11.3808 7.49998 12.5001 6.38069 12.5001 4.99998C12.5001 3.61927 11.3808 2.49998 10.0001 2.49998ZM5.83342 4.99998C5.83342 2.69879 7.69889 0.833313 10.0001 0.833313C12.3013 0.833313 14.1667 2.69879 14.1667 4.99998C14.1667 7.30117 12.3013 9.16665 10.0001 9.16665C7.69889 9.16665 5.83342 7.30117 5.83342 4.99998ZM1.66675 18.3333C1.66675 13.7309 5.39772 9.99998 10.0001 9.99998C14.6024 9.99998 18.3334 13.7309 18.3334 18.3333C18.3334 18.7935 17.9603 19.1666 17.5001 19.1666C17.0398 19.1666 16.6667 18.7935 16.6667 18.3333C16.6667 14.6514 13.682 11.6666 10.0001 11.6666C6.31819 11.6666 3.33341 14.6514 3.33341 18.3333C3.33341 18.7935 2.96032 19.1666 2.50008 19.1666C2.03984 19.1666 1.66675 18.7935 1.66675 18.3333Z"/>
                         </svg>
                         {{ authLink }}
                       </a>
                   </div>
                    <div class="menu-tree-main-mobile">
                      <transition name="fade" appear>
                        <ul v-if="treeMain">
                           <li v-for="s in treeMain">
                               <img v-if="s.ICON" :src="s.ICON" class="burger-catalog-img">
                               <a :href="s.SECTION_PAGE_URL">{{s.NAME}}</a>
                               <span @click="openChild(s)" class="child-arrow" v-if="s.IS_CHILD">
                                  <svg width="7" height="11" viewBox="0 0 7 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1.24264 0.999974L5.48528 5.24261L1.24264 9.48526" stroke-width="2"/>
                                  </svg>
                               </span>
                           </li>
                       </ul>   
                     </transition>
                   </div> 
                   
                    <div v-if="panels" v-for="p in panels" :class="{show:p.show}" class="menu-panel customScroll">
                          <ul>
                           <li v-for="s in p.items">
                               <a :href="s.SECTION_PAGE_URL">{{s.NAME}}</a>
                               <span @click="openChild(s)" class="child-arrow" v-if="s.IS_CHILD">
                                  <svg width="7" height="11" viewBox="0 0 7 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1.24264 0.999974L5.48528 5.24261L1.24264 9.48526" stroke-width="2"/>
                                  </svg>
                               </span>
                           </li>
                       </ul>    
                    </div>
<!--                    <div v-if="treeMain">-->
                       <div class="second-menu">
                            <div v-html="htmlDopMenu"></div>
                            <div v-html="htmlActionMenu"></div>
                         </div>
                          <div class="contacts">
                             <div v-for="contact in contacts" class="contacts-item-wrap">
                                 <div @click="openContact(contact,$event)" class="contacts-item">
                                      <span class="svg-wrap">
                                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                              <path d="M10.0001 0.833374C13.9121 0.833374 17.0834 4.00468 17.0834 7.91671C17.0834 10.4047 15.9353 12.9206 14.0157 15.3755C13.3345 16.2468 12.5936 17.0592 11.8345 17.7992C11.772 17.8601 11.7105 17.9195 11.6501 17.9772L11.3019 18.3039L10.9839 18.5904L10.7 18.8357L10.5265 18.9794C10.2222 19.2274 9.78606 19.2293 9.4795 18.9841L9.29817 18.834L9.0155 18.5898L8.69815 18.3038L8.35001 17.9772L8.16562 17.7992C7.40658 17.0592 6.66568 16.2468 5.98442 15.3755C4.06491 12.9206 2.91675 10.4047 2.91675 7.91671C2.91675 4.00468 6.08805 0.833374 10.0001 0.833374ZM10.0001 2.50004C7.00853 2.50004 4.58341 4.92515 4.58341 7.91671C4.58341 9.9635 5.58574 12.1598 7.29738 14.3489C7.92933 15.1572 8.62062 15.9151 9.32903 16.6057L9.66463 16.9268C9.7752 17.0305 9.88593 17.1344 10.0001 17.2342L10.3355 16.9268L10.6711 16.6057C11.3795 15.9151 12.0708 15.1572 12.7028 14.3489C14.4144 12.1598 15.4167 9.9635 15.4167 7.91671C15.4167 4.92515 12.9916 2.50004 10.0001 2.50004ZM10.0001 4.58337C11.841 4.58337 13.3334 6.07576 13.3334 7.91671C13.3334 9.75765 11.841 11.25 10.0001 11.25C8.15914 11.25 6.66675 9.75765 6.66675 7.91671C6.66675 6.07576 8.15914 4.58337 10.0001 4.58337ZM10.0001 6.25004C9.07961 6.25004 8.33342 6.99624 8.33342 7.91671C8.33342 8.83718 9.07961 9.58337 10.0001 9.58337C10.9206 9.58337 11.6667 8.83718 11.6667 7.91671C11.6667 6.99624 10.9206 6.25004 10.0001 6.25004Z"/>
                                          </svg>
                                      </span>
                                      <span class="contacts-address">{{contact.ADDRESS}}</span>
                                      <span class="arrow-wrap">
                                          <svg width="11" height="7" viewBox="0 0 11 7" fill="none" xmlns="http://www.w3.org/2000/svg" :class="{rotate:contact.show}">
                                              <path d="M9.48532 1.24264L5.24268 5.48528L1.00004 1.24264" stroke-width="2"/>
                                          </svg>
                                       </span>
                                  </div>
                                    <div :ref="'list_'+contact.ID" class="dop-contacts-wrp-mobile" :class="{open:contact.show}">
                                         <a v-if="contact.PHONE" :href="contact.PHONE_URL" class="contacts-phone">{{contact.PHONE}}</a>
                                         <a v-for="p in contact.DOP_CONTACTS" :href="p.link" class="contacts-social">{{p.tile}}</a>
                                    </div>   
                             </div>
                          </div>
                    </div>
<!--                  </div>                -->
               </div>
            
            </div>   
            `
      }).mount('#block_vue_menu_burger');
   }

})(window)

