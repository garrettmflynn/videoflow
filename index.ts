import * as d3 from 'd3'

const key = '1hNrjvmdONl6T5FRwxs468mNin7tEPnSKh2cBynzOti8'

let sceneURI = `https://docs.google.com/spreadsheets/d/${key}/gviz/tq?tqx=out:csv`

d3.csv(sceneURI).then(scenes => {

    const sceneLookup = {}
    scenes.forEach(scene => {
        sceneLookup[scene.ID] = scene
    })

    const title = document.getElementById('title') as HTMLElement
    const content = document.getElementById('content') as HTMLDivElement
    const video = document.querySelector('video') as HTMLVideoElement
    const list = document.querySelector('ul') as HTMLUListElement
    const playAgain = document.getElementById('play-again') as HTMLButtonElement

    const firstID = Object.keys(sceneLookup)[0]

    function showList (scene) {

        let isCircular = false
        const nOpts = Object.keys(scene).reduce((acc, key) => {
            
            if (key !== 'ID' && key.includes('ID')) {

                const num = key.replace('ID', '').trim()
                const id = scene[key]
                if (!id || !num) return acc


                const li = document.createElement('li')
                if (id === scene.ID) {
                    isCircular = true
                    li.classList.add('circular')
                }

                li.innerText = scene[num]
                li.onclick = () => update(id)
                list.appendChild(li)
                return acc + 1
            }

            return acc
        }, 0)

        const isCircularPage = (nOpts === 1 && isCircular)

        if (!nOpts || isCircularPage) {

            playAgain.innerHTML = isCircularPage ? 'Back to Start' : 'Play Again'
            playAgain.removeAttribute('hidden')
            playAgain.onclick = () => {
                playAgain.setAttribute('hidden', 'true')
                update(firstID)
            }

        }
    }

    const update = (id) => {
        const scene = sceneLookup[id]
        const contentValue = scene.Content
        content.innerText = ''
        video.src = ''
        list.innerText = ''

        title.innerText = scene.Title || id

        try {
            const url = new URL(contentValue)
            video.src = url.href
            video.controls = false
            video.autoplay = true
            video.onended = () => {
                video.src = ''
                showList(scene)
            }
        } catch {
            content.innerHTML = contentValue
            showList(scene)
        }
    }

    update(firstID)

})
