const factories: Factory[] = [{
    id: 1,
    name: "factory1",
    created_at: new Date("2024-06-16"),
    updated_at: new Date("2024-06-16")
},
{
    id: 2,
    name: "factory2",
    created_at: new Date("2024-06-17"),
    updated_at: new Date("2024-06-17")
}
]

const spRockets: SpRocket[] = [{
    id: 1,
    teeth: 10,
    outside_diameter: 2,
    pitch: 5,
    pitch_diameter: 4
},
{
    id: 2,
    teeth: 11,
    outside_diameter: 3,
    pitch: 5,
    pitch_diameter: 5
}]

const spRocketsProduction: SpRocketProduction[] = [{
    id: 1,
    factory_id: 1,
    sprocket_id: 1,
    actual: 10,
    goal: 12,
    time: BigInt(11122345),
    factory: factories[0],
    sprocket: spRockets[0]
},
{
    id: 2,
    factory_id: 1,
    sprocket_id: 2,
    actual: 14,
    goal: 10,
    time: BigInt(11134321),
    factory: factories[1],
    sprocket: spRockets[1]
},
{
    id: 3,
    factory_id: 1,
    sprocket_id: 1,
    actual: 10,
    goal: 12,
    time: BigInt(11122346),
    factory: factories[0],
    sprocket: spRockets[0]
},
{
    id: 4,
    factory_id: 2,
    sprocket_id: 2,
    actual: 14,
    goal: 10,
    time: BigInt(11134322),
    factory: factories[1],
    sprocket: spRockets[1]
},
{
    id: 5,
    factory_id: 2,
    sprocket_id: 2,
    actual: 14,
    goal: 10,
    time: BigInt(1113432),
    factory: factories[1],
    sprocket: spRockets[1]
}]
export { factories, spRockets, spRocketsProduction }