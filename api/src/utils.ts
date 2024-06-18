const isNumber = (value: string) => {
    let valid = false
    const isValidNumber = /^\d+$/.exec(value)

    if (isValidNumber) {
        valid = true
    }

    return valid
}

export { isNumber }