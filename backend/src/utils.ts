export function random(len: number){
    let options = "qwertyuiopasdfghjkllzxcvbnm12345678"
    let length = options.length
    let ans=""
    for (let i=0;i<length;i++){
        ans += options[Math.floor(Math.random()*length)]
    }
    return ans
}