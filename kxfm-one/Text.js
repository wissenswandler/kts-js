// various generic utilities around Strings without technical dependencies

// like string.trim() and in addition replaces multiple whitespace characters with a single space
export 
const trim = string => string.trim().replace(/\s+/g, ' ')

// cut a string to a certain length (default: 12) and add an ellipsis if it was longer
export 
const truncate = (string, length = 12) => (""+string).length < length+4 ? (""+string) : (""+string).slice(0, length) + '…' 

export 
const capitalize = str => (""+str).charAt(0).toUpperCase() + (""+str).slice(1)

// translate a string using a dictionary, or a fallback value, or return the string unchanged
export 
const translate = (name, dictionary, fallback) => dictionary[name] ?? fallback ?? name
