async function hello () {
  const who = await Promise.resolve('Volody')
  return who
}

hello().then(console.log)