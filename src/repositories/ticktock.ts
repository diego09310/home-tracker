export function save(name: string[], value: number[] | string[], ts?: number) {
    ts = ts ?? Date.now();
    let nameValues = "";
    for (let i = 0; i < name.length; i++) {
        nameValues += `${name[i]} ${ts} ${value[i]} `;
    }
    console.log(`Fake Saving name: 'put ${nameValues}'`);

}
