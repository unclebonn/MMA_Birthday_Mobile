import { View, Text, StyleSheet, FlatList, SectionList } from 'react-native'
import React from 'react'


////////////////// flat list 
// const menuItemsToDisplay = [
//     { name: 'Hummus', price: '$5.00', id: '1A' },
//     { name: 'Moutabal', price: '$5.00', id: '2B' },
//     { name: 'Falafel', price: '$7.50', id: '3C' },
//     { name: 'Marinated Olives', price: '$5.00', id: '4D' },
//     { name: 'Kofta', price: '$5.00', id: '5E' },
//     { name: 'Eggplant Salad', price: '$8.50', id: '6F' },
//     { name: 'Lentil Burger', price: '$10.00', id: '7G' },
//     { name: 'Smoked Salmon', price: '$14.00', id: '8H' },
//     { name: 'Kofta Burger', price: '$11.00', id: '9I' },
//     { name: 'Turkish Kebab', price: '$15.50', id: '10J' },
//     { name: 'Fries', price: '$3.00', id: '11K' },
//     { name: 'Buttered Rice', price: '$3.00', id: '12L' },
//     { name: 'Bread Sticks', price: '$3.00', id: '13M' },
//     { name: 'Pita Pocket', price: '$3.00', id: '14N' },
//     { name: 'Lentil Soup', price: '$3.75', id: '15O' },
//     { name: 'Greek Salad', price: '$6.00', id: '16Q' },
//     { name: 'Rice Pilaf', price: '$4.00', id: '17R' },
//     { name: 'Baklava', price: '$3.00', id: '18S' },
//     { name: 'Tartufo', price: '$3.00', id: '19T' },
//     { name: 'Tiramisu', price: '$5.00', id: '20U' },
//     { name: 'Panna Cotta', price: '$5.00', id: '21V' },
// ];


// const Item = ({ name, price }: { name: string, price: string }) => (
//     <View style={menuStyles.innerContainer}>
//         <Text style={menuStyles.itemText}>{name}</Text>
//         <Text style={menuStyles.itemText}>{price}</Text>
//     </View>
// );

// const MenuItems = () => {
//     const renderItem = ({ item }: any) => <Item name={item.name} price={item.price} />;

//     return (
//         <View style={menuStyles.container}>
//             <FlatList
//                 data={menuItemsToDisplay}
//                 keyExtractor={(item) => item.id}
//                 renderItem={renderItem}></FlatList>
//         </View>
//     );
// };



// const menuStyles = StyleSheet.create({
//     container: {
//         flex: 1
//     },
//     innerContainer: {
//         paddingHorizontal: 40,
//         paddingVertical: 20,
//         flexDirection: "row",
//         justifyContent: "space-between"
//     },
//     itemText: {
//         color: "#F4CE14",
//         fontSize: 20
//     }
// })

////////////////////////////////////////////////////////////////


const menuItemsToDisplay = [
    {
        title: "Appetizers",
        data: [
            { name: "hummser", price: "$32" },
            { name: "fadsmser1", price: "$32" },
            { name: "aaser2", price: "$32" },
            { name: "basmser3", price: "$32" },
            { name: "csmser4", price: "$32" },
            { name: "weser5", price: "$32" },
            { name: "hsser6", price: "$32" },
        ]
    },
    {
        title: "Main Disches",
        data: [
            { name: "hummser", price: "$32" },
            { name: "hsmmser1", price: "$32" },
            { name: "gsamser2", price: "$32" },
            { name: "lsafmser3", price: "$32" },
            { name: "twmser4", price: "$32" },
            { name: "qqmmser5", price: "$32" },
            { name: "sgmser6", price: "$32" },
        ]
    },
    {
        title: "Sides",
        data: [
            { name: "plaummser", price: "$32" },
            { name: "fwummser1", price: "$32" },
            { name: "kjsaummser2", price: "$32" },
            { name: "ryummser3", price: "$32" },
            { name: "ijsfdummser4", price: "$32" },
            { name: "nanaummser5", price: "$32" },
            { name: "ooummser6", price: "$32" },
        ]
    },
    {
        title: "Desserts",
        data: [
            { name: "lopummser", price: "$32" },
            { name: "nhummser1", price: "$32" },
            { name: "vsummser2", price: "$32" },
            { name: "csummser3", price: "$32" },
            { name: "zsummser4", price: "$32" },
            { name: "jtummser5", price: "$32" },
            { name: "loummser6", price: "$32" },
        ]
    },

]

const Item = ({ name, price }: { name: string, price: string }) => {
    return (
        <View style={menuStyles.innerContainer}>
            <Text style={menuStyles.itemText}>{name}</Text>
            <Text style={menuStyles.itemText}>{price}</Text>
        </View>
    )
}

const MenuItems = () => {
    const renderItem = ({ item }: any) => <Item name={item.name} price={item.price}></Item>
    const renderSectionHeader = ({ section: { title } }: any) => (
        <View style={menuStyles.headerStyle}>
            <Text style={menuStyles.sectionHeader}>{title}</Text>
        </View>
    )

    return (
        <View style={menuStyles.container}>
            <SectionList
                sections={menuItemsToDisplay}
                keyExtractor={(item,index) => item.name + index.toString}
                renderItem={renderItem}
                renderSectionHeader={renderSectionHeader}
            >
            </SectionList>
        </View>
    )
}

const menuStyles = StyleSheet.create({
    container: {
        flex: 1
    },
    innerContainer: {
        paddingHorizontal: 40,
        paddingVertical: 20,
        flexDirection: "row",
        justifyContent: "space-between"
    },
    itemText: {
        color: "#F4CE14",
        fontSize: 20
    },
    headerStyle: { backgroundColor: "#F4CE14" },
    sectionHeader: {
        color: "black",
        fontSize: 26,
        flexWrap: "wrap",
        textAlign: "center"
    }
})
export default MenuItems;

