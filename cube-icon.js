import '@polymer/paper-tooltip/paper-tooltip.js';
import '@polymer/iron-icon/iron-icon.js';
import '@kubex/cube-pagelet/cube-pagelet-content.js';
import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import {CubeTextContentBehavior} from '@kubex/cube-behaviors/cube-text-content-behavior.js';

/**
 An element providing a solution to no problem in particular.

 Example:

 <cube-icon></cube-icon>

 Example:

 <cube-icon>
 <h2>Hello cube-icon</h2>
 </cube-icon>

 @demo demo/index.html
 @hero hero.svg
 */
class CubeIcon extends PolymerElement {
  static get is() {return 'cube-icon';}

  static get behaviors() {return [CubeTextContentBehavior];}

  static get template()
  {
    return html`<style>
       :host {
        display: inline-flex;
        line-height: normal;
        box-sizing: content-box;
        border-color: var(--cube-icon-background-color);
        background-color: var(--cube-icon-background-color);
        color: var(--cube-icon-color);
        fill: currentColor;
        padding: var(--cube-icon-padding, 5px);
        width: var(--cube-icon-size, 24px);
        height: var(--cube-icon-size, 24px);
      }

       :host([round]) {
        border-radius: 100%;
      }

      iron-icon,
      svg,
       ::slotted(svg) {
        display: block;
        width: 100%;
        height: 100%;
      }
    </style>

    <template is="dom-if" if="[[_iconIsToken]]">
      <iron-icon icon="[[icon]]" src="[[src]]"></iron-icon>
    </template>
    <template is="dom-if" if="[[!_iconIsToken]]">
      <cube-pagelet-content html="[[_decodedIcon]]"></cube-pagelet-content>
    </template>

    <slot></slot>

    <template is="dom-if" if="[[alt]]">
      <paper-tooltip>[[alt]]</paper-tooltip>
    </template>`
  }

  static get properties()
  {
    return {
      icon:         {type: String},
      src:          {type: String},
      round:        {type: Boolean, reflectToAttribute: true},
      alt:          {type: String, value: ''},
      size:         {type: Number, observer: '_styleChanged'},
      color:        {type: String, value: '', observer: '_styleChanged'},
      background:   {type: String, value: '', observer: '_styleChanged'},
      _iconIsToken: {type: Boolean, value: false, computed: '_isToken(icon,src)'},
      _decodedIcon: {type: String, computed: '_computeDecodedIcon(_iconIsToken,icon)'}
    }
  }

  attached()
  {
    if(this.getEffectiveChildren().length > 0)
    {
      // strip width/height from svg to allow it to scale to [[size]]
      let svg = this.queryEffectiveChildren('svg');
      if(svg)
      {
        svg.style.width = '100%';
        svg.style.height = '100%';

        if(svg.hasAttribute('width'))
        {
          svg.removeAttribute('width');
        }

        if(svg.hasAttribute('height'))
        {
          svg.removeAttribute('height');
        }
      }
    }
  }

  _styleChanged()
  {
    let props = {
      '--cube-icon-background-color': this.background,
      '--cube-icon-color':            this.color
    };
    if(this.size)
    {
      props['--cube-icon-size'] = this.size + 'px';
    }
    this.updateStyles(props);
  }

  _isToken(icon, src)
  {
    return src || (icon && !!(/^[a-z0-9:-]+$/i.test(icon)));
  }

  _computeDecodedIcon(_iconIsToken, icon)
  {
    if(!_iconIsToken && icon)
    {
      return icon.replace(/%([a-z0-9]{2})/g, this.__decodeChar);
    }
    return '';
  }

  __decodeChar(full, code)
  {
    return String.fromCharCode(
      parseInt(code, full[0] === '%' ? 16 : 10)
    );
  }
}

customElements.define(CubeIcon.is, CubeIcon);