```js
md`# YAML

YAML template literals, simply.`
```

```js echo
yaml`
foo: bar
`
```

```js echo
yaml.unsafe`
foo: bar
undefined: !!js/undefined
regex: !!js/regexp hello
`
```

```js
md`
-----

Five functions are provided with the exact same signature, but different default schemas.

| Function        | Default schema               |
| --------------- | ---------------------------- |
| \`yaml\`        | \`yaml.DEFAULT_SAFE_SCHEMA\` |
| \`yaml.safe\`   | \`yaml.DEFAULT_SAFE_SCHEMA\` |
| \`yaml.unsafe\` | \`yaml.DEFAULT_FULL_SCHEMA\` |
| \`yaml.json\`   | \`yaml.JSON_SCHEMA\`         |
| \`yaml.core\`   | \`yaml.CORE_SCHEMA\`         |

Each function optionally accepts options that will be passed
to [\`yaml.load\`](https://github.com/nodeca/js-yaml#load-string---options-).

Therefore, the two following expressions are equivalent:
~~~js
yaml({ schema: yaml.Schema.create([ FooType ]) })\`bar: !!foo 42\`
yaml([ FooType ])\`bar: !!foo 42\`
~~~

Similarly, the two following expressions are equivalent:
~~~js
yaml({ schema: yaml.CORE_SCHEMA })\`bar: 42\`
yaml.core\`bar: 42\`
~~~

-----
`
```

```js echo
YAML.dump( {dings:"bums"} )
```

```js echo
yaml.dump( {dings:"bums"} )
```

- - -

```js
/* this is the complete module, including e.g. the dump() method */
YAML = await require('https://cdn.jsdelivr.net/npm/js-yaml@3.13.1/dist/js-yaml.min.js')
```

```js
/* this method serves as a tag function for template literals */
yaml = {

  const load = defaultSchema => (strings, ...args) => {
    let firstString = Array.isArray(strings) ? strings.length > 0 && strings[0] : strings
    let options = { schema: defaultSchema }

    if (typeof firstString === 'object') {
      options = Array.isArray(firstString)
        ? { ...options, schema: YAML.Schema.create(firstString) }
        : { ...options, ...firstString }

      return (strings, ...args) => YAML.load(String.raw(strings, ...args), options)
    }

    return YAML.load(String.raw(strings, ...args), options)
  }

  return Object.assign
  (
    load(YAML.DEFAULT_SAFE_SCHEMA)
    , 
    {
      json  : load(YAML.JSON_SCHEMA),
      core  : load(YAML.CORE_SCHEMA),
      safe  : load(YAML.DEFAULT_SAFE_SCHEMA),
      unsafe: load(YAML.DEFAULT_FULL_SCHEMA),
      
      ...YAML
    }
  )
}
```
