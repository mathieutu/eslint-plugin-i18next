/**
 * @fileoverview disallow literal string
 * @author edvardchen
 */
'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require('../../../lib/rules/no-literal-string'),
  RuleTester = require('eslint').RuleTester,
  path = require('path');

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------
const message = 'disallow literal string';
const errors = [{ message }]; // default errors

var ruleTester = new RuleTester({
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  }
});
ruleTester.run('no-literal-string', rule, {
  valid: [
    { code: 'import("hello")' },
    { code: "name === 'Android' || name === 'iOS'" },
    { code: "switch(a){ case 'a': break; default: break;}" },
    { code: 'import name from "hello";' },
    { code: 'a.indexOf("ios")' },
    { code: 'a.includes("ios")' },
    { code: 'a.startsWith("ios")' },
    { code: 'a.endsWith("@gmail.com")' },
    { code: 'export * from "hello_export_all";' },
    { code: 'export { a } from "hello_export";' },
    {
      code:
        'document.addEventListener("click", (event) => { event.preventDefault() })'
    },
    {
      code:
        'document.removeEventListener("click", (event) => { event.preventDefault() })'
    },
    { code: 'window.postMessage("message", "*")' },
    { code: 'document.getElementById("some-id")' },
    { code: 'require("hello");' },
    { code: 'const a = require(["hello"]);' },
    { code: 'const a = require(["hel" + "lo"]);' },
    { code: 'const a = 1;' },
    { code: 'const a = "?";' },
    { code: `const a = "0123456789!@#$%^&*()_+|~-=\`[]{};':\\",./<>?";` },
    { code: 'i18n("hello");' },
    { code: 'dispatch("hello");' },
    { code: 'store.dispatch("hello");' },
    { code: 'store.commit("hello");' },
    { code: 'i18n.t("hello");' },
    { code: 'const a = "absfoo";', options: [{ ignore: ['foo'] }] },
    { code: 'const a = "fooabc";', options: [{ ignore: ['^foo'] }] },
    { code: 'const a = "FOO";' },
    { code: 'var A_B = "world";' },
    { code: 'var a = {["A_B"]: "hello world"};' },
    { code: 'var a = {[A_B]: "hello world"};' },
    { code: 'var a = {A_B: "hello world"};' },
    { code: 'var a = {foo: "FOO"};' },
    { code: 'var a = {foo: "foo"};', options: [{ ignoreProperty: ['foo'] }] },
    { code: 'class Form extends Component { displayName = "FormContainer" };' },
    // JSX
    { code: '<div className="primary"></div>' },
    { code: '<div className={a ? "active": "inactive"}></div>' },
    { code: '<div>{i18next.t("foo")}</div>' },
    { code: '<svg viewBox="0 0 20 40"></svg>' },
    { code: '<line x1="0" y1="0" x2="10" y2="20" />' },
    { code: '<path d="M10 10" />' },
    {
      code:
        '<circle width="16px" height="16px" cx="10" cy="10" r="2" fill="red" />'
    },
    {
      code:
        '<a href="https://google.com" target="_blank" rel="noreferrer noopener"></a>'
    },
    {
      code: '<div id="some-id" tabIndex="0" aria-labelledby="label-id"></div>'
    },
    { code: '<div role="button"></div>' },
    { code: '<img src="./image.png" />' },
    { code: '<button type="button" for="form-id" />' },
    { code: '<DIV foo="bar" />', options: [{ ignoreAttribute: ['foo'] }] },
    { code: '<div>foo</div>', options: [{ ignoreElement: ['div'] }] },
    {
      code: '<div><span>bar</span></div>',
      options: [{ ignoreElement: ['div'] }]
    }
  ],

  invalid: [
    { code: 'a + "b"', errors },
    {
      code: "switch(a){ case 'a': var a ='b'; break; default: break;}",
      errors
    },
    { code: 'export const a = "hello_string";', errors },
    { code: 'const a = "foo";', errors },
    { code: 'const a = call("Ffo");', errors },
    { code: 'var a = {foo: "bar"};', errors },
    { code: 'const a = "afoo";', options: [{ ignore: ['^foo'] }], errors },
    {
      code: 'var a = {foo: "foo"};',
      options: [{ ignoreProperty: ['bar'] }],
      errors
    },
    {
      code: 'class Form extends Component { property = "Something" };',
      errors
    },
    // JSX
    { code: '<div>foo</div>', errors },
    { code: '<div>FOO</div>', errors },
    { code: '<DIV foo="bar" />', errors },
    { code: '<img src="./image.png" alt="some-image" />', errors },
    { code: '<button aria-label="Close" type="button" />', errors },
    { code: '<div>foo</div>', options: [{ ignoreElement: ['span'] }], errors }
  ]
});

//
// ─── VUE ────────────────────────────────────────────────────────────────────────
//

const vueTester = new RuleTester({
  parser: 'vue-eslint-parser',
  parserOptions: {
    sourceType: 'module'
  }
});

vueTester.run('no-literal-string', rule, {
  valid: [{ code: '<template>{{ i18next.t("abc") }}</template>' }],
  invalid: [
    {
      code: '<template>abc</template>',
      errors
    },
    {
      code: '<template>{{"hello"}}</template>',
      errors
    }
  ]
});
// ────────────────────────────────────────────────────────────────────────────────

//
// ─── TYPESCRIPT ─────────────────────────────────────────────────────────────────
//

const tsTester = new RuleTester({
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
    project: path.resolve(__dirname, 'tsconfig.json')
  }
});

tsTester.run('no-literal-string', rule, {
  valid: [
    { code: '<div className="hello"></div>', filename: 'a.tsx' },
    { code: "var a: Element['nodeName']" },
    { code: "var a: Omit<T, 'af'>" },
    { code: `var a: 'abc' = 'abc'` },
    { code: `var a: 'abc' | 'name'  | undefined= 'abc'` },
    { code: "type T = {name: 'b'} ; var a: T =  {name: 'b'}" },
    { code: "function Button({ t= 'name'  }: {t: 'name'}){} " },
    { code: "type T ={t?:'name'|'abc'};function Button({t='name'}:T){}" }
  ],
  invalid: [
    {
      code: `<button className={styles.btn}>loading</button>`,
      filename: 'a.tsx',
      errors
    },

    {
      code: "function Button({ t= 'name'  }: {t: 'name' &  'abc'}){} ",
      errors
    },
    {
      code: "function Button({ t= 'name'  }: {t: 1 |  'abc'}){} ",
      errors
    },
    { code: "var a: {type: string} = {type: 'bb'}", errors }
  ]
});
// ────────────────────────────────────────────────────────────────────────────────
