import './styles/index.scss'

async function hello () {
  const who = await Promise.resolve('Volody')
  return who
}

hello().then(console.log)

console.log('hi hey')