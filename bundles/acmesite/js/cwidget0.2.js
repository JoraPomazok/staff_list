 /**
 * Created by drux on 25.12.2015.
 */
  window.ODW = function(obj)
  {
  
      this.g_url = 'https://omnidesk.ru';
      this.g_iframe_button_id = 'omni_widget_iframe',
      this.g_iframe_widget_id = 'omni_widget_iframe_widget',
      this.g_not_iframe_hint_id = 'omni_widget_hint',
      this.g_not_iframe_tip_id = 'omni_widget_tip',
      this.g_config = {},
      this.config_widget  = null,
      this.email_widget = null,
      this.widget = {},
      this.g_iframe_button = null,
      this.g_not_iframe_hint = null,
      this.g_not_iframe_tip = null,
      this.g_iframe_widget = null,
      this.type_widget  = null,
      this.b_send  = false;
      this.help_size = {};
      this.btn_inited = false;
      this.btn_prev_w = 0;
      this.btn_prev_h = 0;
      this.b_rendered_button = false;
      this.yaCounterId = false;
      this.support_lang = false;
  
      for (var j in obj) {this[j] = obj[j];}
      var self = this;
      this.PreLoad = function () {
          if (window['_g_omni_global_url'])
          {
              self.g_url = window['_g_omni_global_url'];
          }
          self.g_config['diplay_button'] = true; self.g_config['user_info'] = false;
          if (!self.g_config.widget_id) {
              console.log('err; not found widget_id');
              return false;
          }
          self.g_iframe_button_id += '_'+self.g_config.widget_id;
          self.g_iframe_widget_id += '_'+self.g_config.widget_id;
          if(self.g_config.lang)
          {
              self.support_lang = self.g_config.lang;
          }
          if(self.g_config.user)
          {
              for (var j in self.g_config.user) {self.g_config[j] = self.g_config.user[j];}
              delete(self.g_config.user);
          }
          if(self.email_widget)
          {
              self.type_widget = 'email';
          }
          var tmp_interval = setInterval(function () {
              self.LoadWidgetData();
              clearInterval(tmp_interval);
          }, 10)
      }();
      this.Ready  = function()
      {
          if(window.OmniWidgetSetup)
          {
              OmniWidgetSetup(self.g_config.widget_id.match(/^[0-9]+/).toString())
          }
   
          if(self.email_widget.readyQueue[0])
          {
              self.email_widget.readyQueue[0]();
          }
          self.yaCounterId = self.g_config.yaCounterId||self.GetYaCounterId();
          if(self.widget && self.widget.ready)
          {
              self.widget.ready();
          }
          var set_widget_onclick = function (el,obj)
          {
              for (j in el)
              {
                  if (el[j])
                  {
                      el[j].onclick = function ()
                      {
                          if (obj.config_widget['type'].match(/messengers/))
                          {
                              window.frames[obj.g_iframe_button_id + '_name'].postMessage('show_widget', self.g_url);
                          }
                          else
                          {
                              obj.RenderWidget();
                          }
                          return false;
                      };
                  }
              }
          };
          set_widget_onclick(document.getElementsByClassName('omni-email-widget'),self);
          var k = 0;
          for (var kk in window.omni)
          {
              var tmp_wid = window.omni[kk] && window.omni[kk].g_config ? window.omni[kk].g_config.widget_id.match(/^[0-9]+/)[0] : false;
              if(window.cOmni[tmp_wid])
              {
                  set_widget_onclick(document.getElementsByClassName('omni-email-widget_' + k), window.cOmni[tmp_wid]);
                  k++;
              }
  
          }
          tmp_style = document.createElement('style');
          tmp_style.innerHTML=
              '.omni-widget-expanded {overflow: hidden !important;height: 100% !important;width: 100% !important;position: fixed !important;margin: 0 !important;top: 0 !important;left: 0 !important;}';
          let css_rules = ".fade-in-effect{opacity:1!important;visibility:visible!important;transition:.5s opacity,0 .5s visibility!important}.fade-out-effect{opacity:0!important;visibility:hidden!important;transition:.5s opacity,.5s visibility!important}"
          tmp_style.innerHTML+=css_rules;
          
          var head = document.getElementsByTagName("head")[0];
          head.appendChild(tmp_style, head);
  
          setTimeout(function()
          {
              if(!self.btn_inited && self.g_config.diplay_button)
              {
                  self.RenderButton();
              }
          },500);
          window.frames[self.g_iframe_button_id + '_name'].postMessage(self.ObjToStr( {'act':'set_location','location':window.location.href} ), self.g_url);
  
      },
      this.LoadWidgetData = function()
      {
          var body = document.getElementsByTagName("body")[0];
          //в будущем смотреть self.type_widget и уже от типа загружать нужный контент
  //        if(self.g_config.diplay_button) {
              self.g_iframe_button = document.createElement('iframe');
              self.g_iframe_button.id = self.g_iframe_button_id;
              self.g_iframe_button.name = self.g_iframe_button_id + '_name';
              self.g_iframe_button.scrolling="no";
              self.g_iframe_button.style.position = 'absolute';
              self.g_iframe_button.style.top = '-1000px';
              self.g_iframe_button.style.left = '-1234px';
              self.g_iframe_button.style.width = '500px';
              self.g_iframe_button.style.height = '500px';
              self.g_iframe_button.target = '_top';
  
              self.g_iframe_button.src = self.g_url+'/client_widgets/init/' + self.g_config.widget_id + '?btn_hide='+(self.g_config.diplay_button ? 0 : 1)+'&lang='+self.GetBrowserLang();
              body.appendChild(self.g_iframe_button, body);
   //       }
  
          // !!! создание подсказки вне фрейма
          self.g_not_iframe_hint = document.createElement('div');
          self.g_not_iframe_hint.id = self.g_not_iframe_hint_id;
          self.g_not_iframe_hint.name = self.g_not_iframe_hint_id + '_name';
          self.g_not_iframe_hint.style.position = 'absolute';
          self.g_not_iframe_hint.style.top = '-1000px';
          self.g_not_iframe_hint.style.left = '-1234px';
          self.g_not_iframe_hint.style.width = '500px';
          self.g_not_iframe_hint.style.height = '500px';
          self.g_not_iframe_hint.innerHTML = 'Я новая подсказка. Я жива!!!';
          body.appendChild(self.g_not_iframe_hint, body);
  
  
          self.g_iframe_widget = document.createElement('iframe');
          self.g_iframe_widget.id   = self.g_iframe_widget_id;
          self.g_iframe_widget.name = self.g_iframe_widget_id + '_name';
          // self.g_iframe_widget.style.display = 'none';
          self.g_iframe_widget.style.position = 'absolute';
          // self.g_iframe_widget.style.visibility = 'hidden';
          self.g_iframe_widget.style.top = '-4000px';
          self.g_iframe_widget.style.left = '-4000px';
          // self.g_iframe_widget.style.width  = document.body.clientWidth +'px';
          // self.g_iframe_widget.style.height = document.body.clientHeight +'px';
          if(!self.g_config.diplay_button) {
              var body = document.getElementsByTagName("body")[0];
              self.g_iframe_widget.src = self.g_url + '/client_widgets/widget/' + self.g_config.widget_id+'?lang='+self.GetBrowserLang()+'&b_inited_user='+(window._g_omni_b_inited_user ? 1 : 0);
              body.appendChild(self.g_iframe_widget, body);
          }
      },
      this.RenderButton  = function(btn_type,params,show_hint)
      {
          if(!self.config_widget)
              return false;
          self.btn_inited = true;
          var settings = self.config_widget.settings;
          if(!btn_type)
          {
              btn_type = settings.button_type;
          }
          if(!params)
          {
              params = {};
          }
          var css = {
              'background': 'transparent',
              // 'border': 'none',
              'position': 'fixed',
              'z-index': '1000',
              'top' : 'auto',
          };
  
          if(self.g_iframe_button.style.left == '-1234px')
          {
              css['left'] = 'auto';
          }
          this.removeClass(document.getElementsByTagName('body')[0],'omni-widget-expanded');
          this.removeClass(document.getElementsByTagName('html')[0],'omni-widget-expanded');
          if (btn_type == 'resize')
          {
              if(params['b_full_screen'])
              {
                  self.btn_prev_w = parseInt(self.g_iframe_button.style.width);
                  self.btn_prev_h = parseInt(self.g_iframe_button.style.height);
                  this.addClass(document.getElementsByTagName('body')[0],'omni-widget-expanded');
                  this.addClass(document.getElementsByTagName('html')[0],'omni-widget-expanded');
                  css['position'] = 'fixed';
                  css['left']     = '0px';
                  css['top']      = '0px';
                  css['bottom']   = '0px';
                  css['right']    = '0px';
                  css['width']  = window.innerWidth+'px';
                  css['height'] = window.innerHeight+'px';
              }
              else if(params['b_exit_full_screen'])
              {
                  css['width']  = self.btn_prev_w+'px';
                  css['height'] = self.btn_prev_h+'px';
                  css['left']     = '';
                  css['right']    = '';
                  css[settings.button_position]  = '25px';
                  css['bottom']   = '25px';
              }
              else
              {
                  css['width']  = parseInt(params['nw'])+'px';
                  css['height'] = parseInt(params['nh'])+'px';
              }
              // console.log(css);
  
              // css[settings.button_position]  = '0px';
              if(params['bottom'])
                  css['bottom'] = parseInt(params['bottom'])+'px';
                  
          }
          else if(btn_type == 'messengers')
          {
              var ico_margin_b = 0;
              var ico_margin_b_last = 0;
              var supp_val_w, supp_val_h = 0;
              var additionalHeight = 16; // max document.querySelectorAll('.messenger_link.messenger_text').outerHeight()
              switch (settings.ico_size_pixels)
              {
                  case 36: ico_margin_b = 6;  ico_margin_b_last = 12; supp_val_w = 4; supp_val_h = 2; break;
                  case 42: ico_margin_b = 8;  ico_margin_b_last = 16; supp_val_w = 4; supp_val_h = 2; break;
                  case 50: ico_margin_b = 10; ico_margin_b_last = 20; supp_val_w = 4; supp_val_h = 3; break;
              }
              css[settings.button_position]  = '25px';
              css['bottom'] = '0px';
              css['width']  = (settings.ico_size_pixels + supp_val_w + 4)+'px';
              css['height'] = ((settings.ico_size_pixels + supp_val_h +ico_margin_b)*(self.config_widget['channels_cnt']-1)+(settings.ico_size_pixels + supp_val_h +ico_margin_b_last)+settings.ico_size_pixels  + supp_val_h + 24 + additionalHeight)+'px';
          }
          else if( btn_type == 'square')
          {
              var supp_val_h = 0;
              switch (settings.ico_size_pixels)
              {
                  case 36: supp_val_h = 3; break;
                  case 42: supp_val_h = 3; break;
                  case 50: supp_val_h = 3; break;
              }
              css[settings.button_position]  = self.config_widget['type'].match(/messengers/) ? '25px' : '20px';
              css['bottom'] = self.config_widget['type'].match(/messengers/) ? '25px' : '20px';
              // css['width']  = (settings.ico_size_pixels + 4 +(params['help_w'] ? parseInt(params['help_w']) : 0))+'px';
              css['width']  = (settings.ico_size_pixels + 4)+'px';
              css['height'] = ((params['help_h'] ? parseInt(params['help_h'])+supp_val_h : settings.ico_size_pixels +supp_val_h))+'px';
          }
          else if( btn_type == 'line' && (settings.button_position == 'bottom_left' || settings.button_position == 'bottom_right'))
          {
              css[settings.button_position.substr(7)]  = '20px';
              css['bottom'] = '0px';
              if (self.g_config.width_button)
              {
                  css['width'] = self.g_config.width_button;
              }
              else
              {
                  css['min-width'] = '300px';
                  css['max-width'] = '380px';
              }
  
  
              css['height'] = '36px';
          }
          else if(  btn_type == 'line' && (settings.button_position == 'left' || settings.button_position == 'right'))
          {
              css[settings.button_position]  = '0px';
              css['top'] = '50%';
              css['width']  = '36px';
              css['height'] = self.g_config.width_button ? self.g_config.width_button+'px' : '180px';
              css['margin-top'] = self.g_config.width_button ? '-'+(self.g_config.width_button/2)+'px' : '-90px'; //-половина высоты
          }
          css['max-width'] = '100%';
          // console.log(css);
  
          // !!! выбираем позицию подсказки
          if(btn_type !== 'line' && show_hint) {
              self.RenderHint({}, {right:css['right'], left:css['left'], bottom:css['bottom']});
          }
  
          // !!! выбираем позицию подсказки
          if(btn_type !== 'line' && self.config_widget.type !== 'mail') {
              self.RenderTip({}, {right:css['right'], left:css['left'], bottom:css['bottom']});
          }
  
          if(!self.b_rendered_button)
          {
              css['display'] = 'none';
              setTimeout(function () {
                  // self.g_iframe_button.src = self.g_url + '/client_widgets/init/' + self.g_config.widget_id + '?btn_hide=' + (self.g_config.diplay_button ? 0 : 1);
                  self.setCss(self.g_iframe_button, css);
                  self.g_iframe_button.style.border = 'none';
  
                  // self.Show(self.g_iframe_button);
                  self.b_rendered_button = true;
              }, 100);
              setTimeout(function () {
                  self.Show(self.g_iframe_button);
  
                  // !!! показать подсказку - при загрузке
                  if(btn_type !== 'line' && show_hint) {
                      if(show_hint == 'show') {
                          self.removeClass(self.g_not_iframe_hint, 'fade-out-effect')
                          self.addClass(self.g_not_iframe_hint, 'fade-in-effect')
                      } else if(show_hint == 'hide') {
                          self.removeClass(self.g_not_iframe_hint, 'fade-in-effect')
                          self.addClass(self.g_not_iframe_hint, 'fade-out-effect')
                      }
                  }
              }, 300);
          }
              // }
              // else
              // {
              //     this.Show(self.g_iframe_button);
              // }
          this.setCss(self.g_iframe_button, css);
  
          // !!! показать подсказку - при обновлении
          if(this.b_rendered_button)
          { // условие ограничивает отработку этого кода при первой загрузке, чтоб подсказка при опции Отображать сразу после загрузки - появлялась одновременно с кнопкой виджета
              
              if(btn_type !== 'line' && show_hint) { 
                  if(show_hint == 'show') {
                      this.removeClass(self.g_not_iframe_hint, 'fade-out-effect')
                      this.addClass(self.g_not_iframe_hint, 'fade-in-effect')
                  } else if(show_hint == 'hide') {
                      this.removeClass(self.g_not_iframe_hint, 'fade-in-effect')
                      this.addClass(self.g_not_iframe_hint, 'fade-out-effect')
                  } else if(show_hint == 'hide_now') {
                      this.setCss(self.g_not_iframe_hint, {
                      'visibility':'hidden'
                      });
                      this.removeClass(self.g_not_iframe_hint, 'fade-in-effect')
                  }
              }
          }
          
          self.g_iframe_button.style.border = 'none';
          // }
      },
      this.RenderWidget  = function()
      {
          var css_arr = {
              'background': 'transparent',
              'border': 'none',
              'position': 'fixed',
              'z-index': '1000',
              'width': '100%',
              'height': '100%',
              'top': '0px',
              'bottom': '0px',
              'left': '0px',
              'right': '0px',
              'margin_top': '0px'
          };
  
          var body = document.getElementsByTagName("body")[0];
          body.style.cssText = "overflow-y: hidden";
  
          // убираем автоблюр с полей
          var new_this = this; 
          setTimeout(function() {
              new_this.setCss(self.g_iframe_widget, css_arr);
              new_this.Show(self.g_iframe_widget);
          }, 700);
  

          if(window.outside_omni_chatra) {
            window.frames[self.g_iframe_widget_id + '_name'].postMessage('offOmniChatra', self.g_url);
          }

          window.frames[self.g_iframe_widget_id + '_name'].postMessage('update_content_field', self.g_url);
  
          setTimeout(function ()
          {
              self.g_iframe_widget.contentWindow.focus();
              self.g_iframe_widget.focus();
          }, 1000);
  
      },
      this.RenderHint = function(params, position)
      {
          var cssObjHint = {};
          var helper_offset = 0;
          var helper_size = 0;
          var font_size = 0;
          var line_height = 0;
          var border_radius = 0;
          var paddingVal = 0;
  
          switch (self.config_widget.settings.ico_size_pixels)
          {
              case 36: helper_offset = 12; helper_size = 36; font_size = '13px'; line_height = '16px'; border_radius = '4px'; paddingVal = '9px 12px'; break;
              case 42: helper_offset = 16; helper_size = 42; font_size = '14px'; line_height = '18px'; border_radius = '6px'; paddingVal = '10px 16px'; break;
              case 50: helper_offset = 20; helper_size = 50; font_size = '16px'; line_height = '20px'; border_radius = '8px'; paddingVal = '14px 20px'; break;
          }
  
          // !!! обновление цсс (без темы)
          // console.log(position)
          if(position) {
              if(position['right'] !== 'auto' && position['right'] !== undefined) {
                  cssObjHint['right'] = parseInt(position['right']) + helper_size + helper_offset + 'px';
                  cssObjHint['margin-left'] = parseInt(position['right']) + 'px';
              } else if(position['left'] !== 'auto' && position['left'] !== undefined){
                  cssObjHint['left'] = parseInt(position['left']) + helper_size + helper_offset + 'px';
                  cssObjHint['margin-right'] = parseInt(position['left']) + 'px';
              }
              cssObjHint['bottom'] = position['bottom'];
  
              self.setCss(self.g_not_iframe_hint, cssObjHint);
          } else {
              
              cssObjHint = {
                  // 'display': 'none',
                  'opacity': '0',
                  'visibility': 'hidden',
                  'transition': 'opacity 0.5s ease',
                  'position': 'fixed',
                  'z-index': '1000',
                  'top' : 'auto',
                  'bottom' : 'auto',
                  'width' : 'auto',
                  'height' : 'auto',
                  'left' : 'auto',
                  'right' : 'auto',
                  'font-family' : 'Arial, Helvetica, sans-serif',
                  'max-width' : '400px',
                  'border' : '1px solid #ffffff',
                  'background-color' : '#ffffff',
                  'box-sizing' : 'border-box',
                  'word-break': 'break-word',
              };
  
              // !!! текст подсказки
              self.g_not_iframe_hint.innerHTML = params['hint_text']
              
              cssObjHint['font-size'] = font_size;
              cssObjHint['line-height'] = line_height;
              cssObjHint['min-height'] = helper_size + 'px';
              cssObjHint['border-radius'] = border_radius;
              cssObjHint['padding'] = paddingVal;
  
              if(params['theme_css'])
              {
                  let themeCss = JSON.parse(params['theme_css'].replace(/["']/g, '"'));
                  // console.log(themeCss)
                  cssObjHint['border-color'] = themeCss['borderColor'];
                  cssObjHint['background-color'] = themeCss['backgroundColor'];
                  cssObjHint['color'] = themeCss['color'];
              }
  
              self.setCss(self.g_not_iframe_hint, cssObjHint);
          }        
  
      },
      this.RenderTip = function(params, position)
      {
          // console.log(self.config_widget.settings)
          // console.log(params)
          if(Object.keys(params).length !== 0 && params.constructor === Object) {
              if(params['tip_info'].length == 0) {
                  return
              }
          }
         
          if(this.g_not_iframe_tip == null && Object.keys(params).length !== 0 && params.constructor === Object) {
              
              let body = document.getElementsByTagName("body")[0];
  
              let info = params['tip_info'] ? JSON.parse(params['tip_info'].replace(/["']/g, '"')) : {};
              // console.log(params['tip_info'])
          
              this.g_not_iframe_tip = document.createElement('div');
              this.g_not_iframe_tip.id = this.g_not_iframe_tip_id;
              body.appendChild(this.g_not_iframe_tip, body);
              
              let tip_container = document.getElementById(this.g_not_iframe_tip_id);
              for(let item in info) {
                  let text = info[item]['text'].toString();
                  let type = info[item]['type'].toString();
  
                  let temp_channel = document.createElement('div');
                  temp_channel.id = this.g_not_iframe_tip_id + '_' + type;
                  temp_channel.dataset.omniType = type;
                  temp_channel.innerText = text;
                  // console.log(temp_channel)
                  tip_container.appendChild(temp_channel, tip_container);
              }
          }
  
          var cssObjTipContainer = {};
          var cssObjTip = {};
          var helper_offset = 0;
          var helper_size = 0;
          var font_size = 0;
          var line_height = 0;
          var border_radius = 0;
          var paddingVal = 0;
  
          switch (self.config_widget.settings.ico_size_pixels)
          {
              case 36: helper_offset = 12; helper_size = 36; marg_offset = 6; font_size = '13px'; line_height = '16px'; border_radius = '4px'; paddingVal = '4px 9px'; helper_bottom = 23; break;
              case 42: helper_offset = 16; helper_size = 42; marg_offset = 8; font_size = '14px'; line_height = '18px'; border_radius = '6px'; paddingVal = '6px 11px'; helper_bottom = 25;break;
              case 50: helper_offset = 20; helper_size = 50; marg_offset = 10; font_size = '16px'; line_height = '20px'; border_radius = '8px'; paddingVal = '8px 13px'; helper_bottom = 25; break;
          }
  
          let btn_pos = self.config_widget.settings.button_position;
  
          // !!! обновление цсс (без темы)
          // console.log(params)
          if(position && this.g_not_iframe_tip !== null) {
              cssObjTipContainer = {
                  'opacity': '0',
                  'visibility': 'hidden',
                  'transition': 'opacity 0.5s ease',
                  'position': 'fixed',
                  'z-index': '999',
                  'top' : 'auto',
                  'bottom' : 'auto',
                  'width' : '400px',
                  'height' : 'auto',
                  'left' : 'auto',
                  'right' : 'auto',
              };
  
              if(position['right'] !== 'auto' && position['right'] !== undefined) {
                  cssObjTipContainer['right'] = parseInt(position['right']) + helper_size + helper_offset + 'px';
              } else if(position['left'] !== 'auto' && position['left'] !== undefined){
                  cssObjTipContainer['left'] = parseInt(position['left']) + helper_size + helper_offset + 'px';
              }
              cssObjTipContainer['bottom'] = position['bottom'];
  
              self.setCss(self.g_not_iframe_tip, cssObjTipContainer);
          } else {
              cssObjTip = {
                  'opacity': '0',
                  'visibility': 'hidden',
                  'transition': 'opacity 0.5s ease',
                  'position': 'absolute',
                  'z-index': '999',
                  'top' : 'auto',
                  'bottom' : 'auto',
                  'width' : 'auto',
                  'max-width' : '400px',
                  'height' : 'auto',
                  // 'left' : 'auto',
                  // 'right' : '0',
                  'font-family' : 'Arial, Helvetica, sans-serif',
                  // 'border' : '1px solid #ffffff',
                  'background-color' : '#ffffff',
                  'box-sizing' : 'border-box',
                  'color' : '#000000',
              };
  
              cssObjTip['font-size'] = font_size;
              cssObjTip['line-height'] = line_height;
              cssObjTip['border-radius'] = border_radius;
              cssObjTip['padding'] = paddingVal;
  
              if(btn_pos == 'left') {
                  cssObjTip['right'] = 'auto';
                  cssObjTip['left'] = '0';
              } else {
                  cssObjTip['left'] = 'auto';
                  cssObjTip['right'] = '0';
              }
  
              if(params['tip_css'])
              {
                  let themeCss = JSON.parse(params['tip_css'].replace(/["']/g, '"'));
                  cssObjTip['background-color'] = themeCss['backgroundColor'];
                  cssObjTip['color'] = themeCss['color'];
              }
              
              let tips = document.querySelectorAll('[id^="' + this.g_not_iframe_tip_id + '_"]');
  
              for(let i=0; i<tips.length; i++) {
                  self.setCss(tips[i], cssObjTip);
  
                  let tip_h = tips[i].clientHeight; // если будет border, то + 2
                  let diff_h = tip_h > helper_size ? -1*((tip_h - helper_size) / 2) : (helper_size-tip_h) / 2;
                  // console.log(diff_h)
  
                  let bottom_val =  helper_size * (tips.length  - i) + marg_offset * (tips.length  - i) + marg_offset + helper_bottom + diff_h; 
                  cssObjTip['bottom'] = bottom_val +'px';
                  self.setCss(tips[i], cssObjTip);
              }
              
          }        
  
      },
      this.ActionTip = function(params)
      {
          if(params) {
              let action_type = params['action_type'];
              let btn_type = !params['btn_type'] ? self.config_widget.settings.button_type : params['btn_type'];
              
              if(btn_type !== 'line' && this.config_widget['type'] !== "mail") {
                  let tip_container = document.getElementById(this.g_not_iframe_tip_id);
                  let tips_all = tip_container.getElementsByTagName('div');
              
                  if(action_type == 'show') {
                      let tip_target = document.getElementById('omni_widget_tip_' + btn_type);
  
                      for (let i = 0; i < tips_all.length; i++) {
                          self.removeClass(tips_all[i], 'fade-in-effect')
                          self.removeClass(tips_all[i], 'fade-out-effect')
                      }
                      
                      self.removeClass(tip_container, 'fade-out-effect')
                      self.addClass(tip_container, 'fade-in-effect')
  
                      self.addClass(tip_target, 'fade-in-effect')
  
                  } else if(action_type == 'hide') {
                      for (let i = 0; i < tips_all.length; i++) {
                          self.removeClass(tips_all[i], 'fade-in-effect')
                          self.removeClass(tips_all[i], 'fade-out-effect')
                      }
                      self.removeClass(tip_container, 'fade-in-effect')
                      self.removeClass(tip_container, 'fade-out-effect')
  
                  }
              }
          }     
  
      },
      this.CloseWidget  = function() {
          var body = document.getElementsByTagName("body")[0];
          body.style.cssText = "overflow-y: auto";
  
          this.Hide(self.g_iframe_widget);
          if(self.b_send)
          {
              self.g_iframe_widget.src = self.g_url + '/client_widgets/widget/' + self.g_config.widget_id+'?lang='+self.GetBrowserLang()+'&b_inited_user='+(window._g_omni_b_inited_user ? 1 : 0);
              self.b_send = false;
          }
      };
      this.listen_iframe = function (e) {
          var self_ = self;
          // console.log(e);
          if(e.data && e.origin.match(/vk\.com/))
          {
              if(typeof e.data == 'string' && e.data.match(/\["minimize"/))
              {
                  this.Hide(document.querySelectorAll('#omni_vk_community_messages iframe')[0]);
                  this.Show(self.g_iframe_button);
              }
              else if (typeof e.data == 'string' && (e.data.match(/\:\["showBox",/) || e.data.match(/\:\["newMessage",/)) ) {
                  if(_omni_vk_chat)
                  {
                      _omni_vk_chat.expand();
                  }
                  this.Show(document.querySelectorAll('div#omni_vk_community_messages')[0]);
                  this.Show(document.querySelectorAll('div#omni_vk_community_messages')[0].querySelectorAll('iframe')[0]);
                  this.Hide(self.g_iframe_button);
              }
          }
          if(e.data && e.origin.match(/facebook\.com/))
          {
              if(typeof e.data == 'string' && e.data.match(/liveChatPluginHideDialogIframe|liveChatPluginShowDialogIframe/))
              {
                  this.setCss(document.querySelectorAll('#omni_fb_community_messages iframe')[0],{
                      'max-height':'0px'
                  });
                  this.Hide(document.querySelectorAll('#omni_fb_community_messages iframe')[0]);
                  this.Show(self.g_iframe_button);
              }
          }
          if(e.data && e.origin.match(/chat\.chatra\.io/) && !window.outside_omni_chatra)
          {
              // console.log(e.data);
  
              if(typeof e.data == 'string' && e.data.match(/\"type\":\"collapseWindow\",/))
              {
                this.Hide(document.querySelectorAll('div#chatra')[0]);
                this.Show(self.g_iframe_button);
              }
              else if(typeof e.data == 'string' && (
                  e.data.match(/:\"titleBlink\",\"data\":\"Новое сообщение/)
                  || e.data.match(/:\"titleBlink\",\"data\":\"New message/)
                  || e.data.match(/:\"titleBlink\",\"data\":\"Neue Nachricht/)
                  || e.data.match(/:\"titleBlink\",\"data\":\"Nouveau message/)
                  || e.data.match(/:\"titleBlink\",\"data\":\"Nuevo mensaje/)
                  || e.data.match(/:\"titleBlink\",\"data\":\"Nova mensagem/)
                  || e.data.match(/:\"titleBlink\",\"data\":\"Nieuw bericht/)
                  || e.data.match(/:\"titleBlink\",\"data\":\"Nuovo messaggio/)
  
  //                || e.data.match(/lastHumanMessageAt/)
                  //                || e.data.match(/\"type\":\"transparentChatHeight\"/)
              )
              )
              {
                  if(!Chatra._chatExpanded)
                  {
                      Chatra('openChat', window);
                  }
                  this.Show(document.querySelectorAll('div#chatra')[0]);
                  Chatra('show');
                  this.Hide(self.g_iframe_button);
              }
              else if(typeof e.data == 'string' && e.data.match(/{\"type\":\"showChat\"/))
              {
                  window.frames[self_.g_iframe_button_id + '_name'].postMessage('chatra_show', self_.g_url);
              }
              else if(typeof e.data == 'string' && e.data.match(/{\"type\":\"hideChat\"/))
              {
                  window.frames[self_.g_iframe_button_id + '_name'].postMessage('chatra_hide', self_.g_url);
              }
          }
          else if(e.data && e.origin == self_.g_url)
          {
                  data = e.data;
              if(typeof data === 'string')
              {
                  if(!data.match(/^\{/) || !data.match(/\}$/))
                  {
                      return false;
                  }
                  data = data.replace(/\n/g, ' ');
                  data = JSON.parse(data);
              }
              var tmp_widget_id = parseInt(data.widget_id);
              self_ = cOmni[tmp_widget_id];
              if(data['act'] && data['act'] == 'change_channels_cnt')
              {
                  self.config_widget.channels_cnt = data.channels_cnt;
              }
              else if(data['act'] && data['act'] == 'yaReachGoal')
              {
                  self_.YaReachGoal(data['target'])
              }
              else if(data['act'] && data['act'] == 'fb_chat_open')
              {
                  this.Show(document.getElementById('fb-root'));
                  this.Show(document.querySelectorAll('#omni_fb_community_messages iframe')[0]);
                  this.setCss(document.querySelectorAll('#omni_fb_community_messages iframe')[0],{
                     'max-height':'100%'
                  });
                  document.querySelectorAll('#omni_fb_community_messages iframe')[0].setAttribute('class','fb_customer_chat_bounce_in');
                  this.Hide(self.g_iframe_button);
              }
              else if(data['act'] && data['act'] == 'init_fb_chat')
              {
                  window.fbAsyncInit = function() {
                      FB.init({
                          xfbml            : true,
                          version          : 'v3.2'
                      });
                  };
  
                  button_position = self_.config_widget.settings.button_position;
                  tmp_div = document.createElement('div');
                  tmp_div.setAttribute('id','omni_fb_community_messages');
                  tmp_div.setAttribute('class','fb-customerchat');
                  tmp_div.setAttribute('page_id',data['fb_page_id']);
                  tmp_div.setAttribute('minimized','true');
                  var body = document.getElementsByTagName("body")[0];
                  body.appendChild(tmp_div, body);
  
                  tmp_style = document.createElement('style');
                  tmp_style.innerHTML=
                          'div#fb-root {display:none; z-index:2001}'
                         +'div#fb-root .fb_dialog{display: none !important;}'
                         +'#omni_fb_community_messages iframe {bottom: 25px !important; '+(button_position == 'right' ? 'right: 25px !important' : 'left:25px;right: 0px !important')+';border-bottom-left-radius: 0 !important;border-bottom-right-radius: 0 !important;height: 399px !important;overflow: hidden !important;display: none;box-shadow: 0 0 0 0; !important; display none !important}';
                  var head = document.getElementsByTagName("head")[0];
                  head.appendChild(tmp_style, head);
  
                  var s= document.createElement("script");
                  s.type="text/javascript";
                  s.async=!0;
                  s.src = (document.location.protocol === 'https:' ? 'https:' : 'http:')+ '//connect.facebook.net/en_US/sdk/xfbml.customerchat.js';
                  var body = document.getElementsByTagName("body")[0];
                  body.parentNode.appendChild(s,body);
  
              }
              else if(data['act'] && data['act'] == 'chatra_chat_open' && !window.outside_omni_chatra)
              {
                  if(window.Chatra)
                  {
                      button_position = self_.config_widget.settings.button_position;
                      cls_list = document.querySelectorAll('div#chatra')[0].className;
                      cls_list = cls_list.replace(/chatra--pos-right/,'').replace(/chatra--pos-left/,'')+' '+(button_position == 'right' ? 'chatra--pos-right' : 'chatra--pos-left');
                      document.querySelectorAll('div#chatra')[0].setAttribute('class',cls_list);
                      if(button_position == 'left')
                      {
                          this.setCss(document.querySelectorAll('div#chatra')[0],{'left':'25px'})
                      }
                      Chatra('openChat',window);
                      this.Show(document.querySelectorAll('div#chatra')[0]);
                      Chatra('show');
                      this.Hide(self.g_iframe_button);
                  }
  
              }
              else if(data['act'] && data['act'] == 'init_vk_chat')
              {
                  var vk_div = document.createElement('div');
                  vk_div.id = 'omni_vk_community_messages'
                  vk_div.style ='display:none'
                  document.getElementsByTagName("body")[0].appendChild(vk_div)
  
                  var s = document.createElement('script');
                  s.async = true;
                  s.src = (document.location.protocol === 'https:' ? 'https:' : 'http:') +
                      '//vk.com/js/api/openapi.js?141';
                  if (document.head) document.head.appendChild(s);
                  var vk_interval = setInterval(function (d) {
                      if (!window.VK)
                          return;
                      clearInterval(vk_interval);
                      window._omni_vk_chat = VK.Widgets.CommunityMessages("omni_vk_community_messages", d['chat_key'], {
                          disableExpandChatSound: "1",
                          disableButtonTooltip: "1",
                          expanded: "1"
                      });
                      setTimeout(function () {
                          self_.setCss(document.querySelectorAll('div#omni_vk_community_messages')[0],{
                              'right':'-7px',
                              'bottom':'20px'
                          });
                      },500)
                  }, 1000,data);
  
              }
              else if(data['act'] && data['act'] == 'vk_chat_open')
              {
                  // this.Show(document.getElementById('fb-root'));
                  // this.Show(document.querySelectorAll('#omni_fb_community_messages iframe')[0]);
                  // this.setCss(document.querySelectorAll('#omni_fb_community_messages iframe')[0],{
                  //     'max-height':'100%'
                  // });
                  // document.querySelectorAll('#omni_fb_community_messages iframe')[0].setAttribute('class','fb_customer_chat_bounce_in');
                  // this.Hide(self.g_iframe_button);
                  if(_omni_vk_chat)
                  {
                      _omni_vk_chat.expand();
                  }
                  this.Show(document.querySelectorAll('div#omni_vk_community_messages')[0]);
                  this.Show(document.querySelectorAll('div#omni_vk_community_messages')[0].querySelectorAll('iframe')[0]);
                  this.Hide(self.g_iframe_button);
  
              }
              else if(data['act'] && data['act'] == 'init_chatra_chat')
              {
                  if(!window.ChatraSetup)
                  {
                      window.ChatraSetup = {};
                  }
                  if(!window.ChatraIntegration)
                  {
                      window.ChatraIntegration = {};
                  }
                  window.ChatraSetup['startHidden'] = true;
                  window.ChatraSetup['disableChatOpenHash'] = true;
  
                  if(data['chatra_group'] && data['chatra_group'].length>1)
                  {
                      window.ChatraSetup['groupId'] = data['chatra_group'];
                  }
                  if (data.chatra_i_data)
                  {
                      for (var t_i in data.chatra_i_data)
                      {
                          if(!window.ChatraIntegration[t_i])
                          {
                              window.ChatraIntegration[t_i] = data.chatra_i_data[t_i];
                          }
                      }
                  }
  
                  (function (d, w, c)
                  {
                      w.ChatraID = data['chat_key'];

                      if(window.outside_omni_chatra) {
                            return false;
                        }

                      var s = d.createElement('script');
                      w[c] = w[c] || function ()
                      {
                          (w[c].q = w[c].q || []).push(arguments);
                      };
                      s.async = true;
                      s.src = (d.location.protocol === 'https:' ? 'https:' : 'http:')
                          + '//call.chatra.io/chatra.js';
                      if (d.head) d.head.appendChild(s);
                  })(document, window, 'Chatra');
                  if(!window.outside_omni_chatra) {
                    Chatra('updateIntegrationData', window.ChatraIntegration);

                    setTimeout(function() {
                            self_.Hide(document.querySelectorAll('div#chatra')[0]);
                            Chatra('openChat',window);
                            // Chatra('show');
                    }, 300)

                    setTimeout(function() {
                            Chatra('minimizeWidget');
                            self_.Hide(document.querySelectorAll('div#chatra')[0]);
        
                            if(Chatra._chatHiddenByFrame)
                            {
                                window.frames[self_.g_iframe_button_id + '_name'].postMessage('chatra_hide', self_.g_url);
                            }
                    }, 500)
                  }
              }
              else if(data['act'] && data['act'] == 'link_click')
              {
                  if(!document.getElementById('omni_hidden_mlink'))
                  {
                      var body = document.getElementsByTagName("body")[0];
                      var tmp_a = document.createElement('a');
                      tmp_a.id = 'omni_hidden_mlink';
                      tmp_a.target = '_blank';
                      body.appendChild(tmp_a, body);
                  }
                  document.getElementById('omni_hidden_mlink').href = data['href'];
                  document.getElementById('omni_hidden_mlink').click();
              }
              else if(data['act'] && data['act'] == 'btn_resize')
              {
                  self_.RenderButton('resize',data);
              }
              else if(data['act'] && data['act'] == 'show_help')
              {
                  // if(data['help_w'])
                  // {
                  //     self_.help_size = data;
                  // }
                  // else
                  // {
                  //     window.frames[self_.g_iframe_button_id + '_name'].postMessage('show_help', self_.g_url);
                  // }
                  self_.RenderButton(0, self_.help_size, 'show');
              }
              else if(data['act'] && data['act'] == 'hide_help')
              {
                  self_.RenderButton(0, false, 'hide');
              }
              else if(data['act'] && data['act'] == 'hide_help_now')
              {
                  self_.RenderButton(0, false, 'hide_now');
              }
              else if(data['act'] && data['act'] == 'update_help')
              {
                  // console.log(data)
                  self_.RenderHint(data);
              }
              else if(data['act'] && data['act'] == 'update_tip')
              {
                  // console.log(data)
                  self_.RenderTip(data);
              }
              else if(data['act'] && data['act'] == 'action_tip')
              {
                  self_.ActionTip(data);
              }
              else if(data['act'] && (data['act'] == 'messenger_close' || data['act'] == 'update_size_btn'))
              {
                  self_.RenderButton();
              }
              else if(data['act'] && data['act'] == 'init_widget')
              {
                  if(self_.config_widget['type'].match(/messengers/) && !data['b_open_widget'])
                  {
                      self_.RenderButton('messengers');
                      return;
                  }
                  else// if(data['b_open_widget'])
                  {
                      self_.RenderButton();
                  }
                  window.frames[self_.g_iframe_widget_id + '_name'].postMessage('render_widget_'+data['type'], self_.g_url);
                  self_.RenderWidget();
  
                  if(self_.config_widget['type'] == "knowledge_mail" && self_.config_widget['settings']['knowledge_type'] == "search")
                  {
                      window.frames[self_.g_iframe_widget_id + '_name'].postMessage('focus_search', self_.g_url);
                  }
                  if(self_.config_widget['type'] == "mail")
                  {
                      window.frames[self_.g_iframe_widget_id + '_name'].postMessage('update_form', self_.g_url);
                  }
              }
              else if(data['act'] && data['act'] == 'resize_button')
              {
                  self_.g_config.width_button = data['value'];
              }
  
              else if(data['act'] && data['act'] == 'close_widget')
              {
                  return self_.CloseWidget();
              }
              else if(data['act'] && data['act'] == 'success_send')
              {
                  self_.b_send = true;
                  if(window.CasesDynamic && location.pathname.indexOf('user/cases') !== -1 && location.pathname.indexOf('record') == -1){
                      CasesDynamic();
                  }
              }
              else if(data['act'] && data['act'] == 'loaded_widget')
              {
                  if(self_.type_widget && self_.type_widget == 'email')
                  {
                      var params = {
                          'user_info' : self_.g_config.user_info ? {'location':window.location.href,'ua': navigator.userAgent } :false,
                          'identify' : self_.email_widget.identify||self_.widget.identify||null,
                          'case_subject' : self_.email_widget.case_subject||self_.widget.case_subject||null,
                          'search_str' : self_.email_widget.search||self_.widget.search||null,
                      };
                      window.frames[self_.g_iframe_widget_id + '_name'].postMessage(self_.ObjToStr( params ),self_.g_url);
                  }
  
              }
              else if(data['act'] && data['act'] == 'loaded_btn')
              {
                  params = {
                      'user_info' : self_.g_config.user_info ? {'location':window.location.href,'ua': navigator.userAgent } :false,
                      'identify' : self_.email_widget.identify||self_.widget.identify||null,
                  };
                  window.frames[self_.g_iframe_button_id+ '_name'].postMessage(self_.ObjToStr( params ),self_.g_url);
              }
              else if(data.widget_id && !self_.config_widget)
              {
                  if(data['type'] != "messengers" && self_.g_config.diplay_button)
                  {
                      var body = document.getElementsByTagName("body")[0];
                      self_.g_iframe_widget.src = self_.g_url + '/client_widgets/widget/' + self_.g_config.widget_id+'?lang='+self.GetBrowserLang()+'&b_inited_user='+(window._g_omni_b_inited_user ? 1 : 0);
                      body.appendChild(self_.g_iframe_widget, body);
                  }

                    window.outside_omni_chatra = Array.from(document.head.getElementsByTagName('script')).some( function(item) { return item.src.match('call.chatra.io/chatra.js') !== null } );
            
                    if(window.outside_omni_chatra) {
                        window.frames[self_.g_iframe_button_id+ '_name'].postMessage('offOmniChatra', self_.g_url);
                    }

                  self_.config_widget = data;
                  self_.Ready();
              }
          }
      },
      this.ObjToStr  = function(o,quotes){
          quotes = quotes ? quotes : '"';
  
          var parse = function(_o,_quotes){
              var a = [], t;
  
              for(var p in _o){
                  if(_o.hasOwnProperty(p)){
                      t = _o[p];
                      if(t && typeof t == "object")
                      {
                          a[a.length]= _quotes+p+_quotes + ":{ " + arguments.callee(t,_quotes).join(", ") + "}";
                      }
                      else// if (t)
                      {
                          if(typeof t == "string"){
                              a[a.length] = [ _quotes+p+_quotes+ ": "+_quotes  + encodeURIComponent(t.toString()) + _quotes ];
                          }
                          else if(t){
                              a[a.length] = [ _quotes+p+_quotes+ ": " + t.toString()];
                          }
  
                      }
                  }
              }
  
              return a;
          };
  
          return "{" + parse(o,quotes).join(", ") + "}";
      };
  
      this.setCss = function(element, arr) {
          var css_arr = [];
          var current_style = element.style.cssText;
          var styles_arr = current_style.trim().split(';');
          var tmp_style;
          var w = null;
          var h = null;
          var css_string = '';
          for (var row in styles_arr) {
              if(typeof  styles_arr[row] == 'string')
              {
                  styles_arr[row] = styles_arr[row].trim();
                  if (styles_arr[row].length != 0)
                  {
                      tmp_style = styles_arr[row].split(':');
                      css_arr[tmp_style[0]] = tmp_style[1]
                  }
              }
          }
          for (style in arr) {
              css_arr[style] = arr[style]
          }
          for (elem in css_arr) {
              css_string = css_string + elem + ': ' + css_arr[elem] + '; ';
          }
          element.style.cssText = css_string;
      };
      this.addClass = function (element,name) {
          arr = element.className.split(" ");
          if (arr.indexOf(name) == -1) {
              element.className = (element.className + " " + name).trim();
          }
      };
      this.removeClass = function(element,name)
      {
          element.className = element.className.replace(new RegExp(name,'g'), "").trim();
      };
      this.Show = function (element) {
          if(element)
          {
              this.setCss(element, {'display': 'block'});
          }
      };
      this.Hide = function (element) {
          if(element)
          {
              this.setCss(element, {'display': 'none'});
          }
      };
      this.GetYaCounterId = function () {
          var id = null;
          for(var i in window){ if(i.match(/^yaCounter([0-9]+)/)){id=i.match(/^yaCounter([0-9]+)/)[1];break}}
          return id;
      };
      this.YaReachGoal = function (target_name) {
          if(!this.yaCounterId) { return false; }
          if(window.ym)
          {
              ym(this.yaCounterId, 'reachGoal', target_name);
              return true;
          }
          else if(window['yaCounter'+this.yaCounterId])
          {
              window['yaCounter'+this.yaCounterId].reachGoal(target_name);
              return true;
          }
          return false
      }
      this.GetBrowserLang = function() {
          var language = window.navigator ? (window.navigator.language ||
              window.navigator.systemLanguage ||
              window.navigator.userLanguage) : "ru";
          if(self.support_lang)
          {
              language = self.support_lang;
          }
          return  language.substr(0, 2).toLowerCase();
      }
  };
  var OmniWidgetApi = {
      call : function (str, data) {
          str = str.split('.');
          var tmp = Object.keys(cOmni);
          var cW = str[1] && cOmni[str[1]] ? cOmni[str[1]] : cOmni[tmp[0]]
          var key = str[0];

          if(key == 'get_list')
          {
              var tmp = Object.keys(cOmni);
              console.log('Widget id         Widget title');
              for(var i in tmp)
              {
                  console.log(tmp[i]+(new Array(19-tmp[i].toString().length).join(' '))+cOmni[tmp[i]].config_widget.title)
              }
          }
          else if(key == 'open')
          {
              window.frames[cW.g_iframe_button_id + '_name'].postMessage('gOmniListShow', cW.g_url);
          }
          else if(key == 'close')
          {
              window.frames[cW.g_iframe_button_id + '_name'].postMessage('gOmniListHide', cW.g_url);
          }
          else if(key == 'open_widget')
          {
              cW.RenderWidget();
          }
          else if(key == 'close_widget')
          {
              cW.CloseWidget();
          }
          else if(key == 'hide_btn')
          {
              cW.Hide(cW.g_iframe_button);
          }
          else if(key == 'show_btn')
          {
              cW.Show(cW.g_iframe_button);
          }
          else if(key == 'identify')
          {
              if (data)
              {
                  let new_data = JSON.stringify(data).replace(/["']/g, "'");
                  window.frames[cW.g_iframe_widget_id + '_name'].postMessage('set_fields_after'+new_data, cW.g_url);
              }
          }
          else if(key == 'reset')
          {
              window.frames[cW.g_iframe_widget_id + '_name'].postMessage('reset', cW.g_url);
          }
      }
  }
  !function(){
      if(window.b_omni_loaded) return;    window.b_omni_loaded = true; window.cOmni = {}; if(omni.g_config) {omni = [omni]}
      for (var j in omni) {if (j.match(/^[0-9]+$/)){ cClass = cOmni[omni[j].g_config.widget_id.match(/^[0-9]+/).toString()] = new ODW(omni[j]);}}
      if (typeof window.addEventListener != 'undefined')
          window.addEventListener('message', function(e){cClass.listen_iframe(e)}, false);
      else if (typeof window.attachEvent != 'undefined')
          window.attachEvent('onmessage', function(e){cClass.listen_iframe(e)});
  }();
  