import { create } from "zustand";

interface bienmacdinhprops {
    bienmacdinh: {
        name: string,
        age: number
    }
}

export const callapigetuser = create(set => ({
    bienmacdinh: {
        name: "",
        age: 0
    },
    getUserDetail: () => set((state:bienmacdinhprops) => {
        //goi api sau khi lay duoc response thi gan lai vao trong state bienmacdinh

        // ....code
        
        //day la cach de cap nhat gia tri trong state
        //khi state duoc cap nhat thi component se tu dong render lai 
        state.bienmacdinh.age = 1
    })
}))