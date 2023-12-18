import {useState, useEffect, useRef} from 'react'
import {Animated, StyleSheet, FlatList, View, Text, TouchableWithoutFeedback, SafeAreaView, TextInput, TouchableOpacity} from 'react-native'
import Material from 'react-native-vector-icons/MaterialCommunityIcons'
import {masterData} from '../data'

export default () => {

    const [data, setData] = useState(masterData)
    const [text, setText] = useState('')

    const [drowpdown, setDropDown] = useState({
        itemValue: null,
        itemLabel: null,
    })

    const {itemValue, itemLabel} = drowpdown

    const [toggle, setToggle] = useState(0)
    const [toggleLong, setToggleLong] = useState(0)

    const animation = useRef(new Animated.Value(0)).current
    const scale = useRef(new Animated.Value(0)).current

    useEffect(() => {
        handleAnimatedLong()
    }, [toggleLong])

    const handleAnimatedLong = () => {
        Animated.spring(scale, {
            toValue: toggleLong ? 1 : 0,
            friction: 5,
            useNativeDriver: false
        }).start()
    }

    useEffect(() => {
        handleAnimated()
    }, [toggle])

    const handleAnimated = () => {
        Animated.timing(animation, {
            toValue: toggle ? 1 : 0,
            duration: 200,
            useNativeDriver: false
        }).start()
    }

    const arrowStyle = {
        transform: [
            {
                rotate: animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '90deg'],
                    extrapolate: 'clamp'
                })
            }
        ]
    }

    const translate = {
        transform: [
            {
                translateX: animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [itemValue ? -40 : 0, -40],
                    extrapolate: 'clamp'
                })
            },
            {
                translateY: animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [itemValue ? -25 : 0, -25],
                    extrapolate: 'clamp'
                })
            },
            {
                scale: animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [itemValue ? 0.8 : 1, 0.8],
                    extrapolate: 'clamp'
                })
            },
        ]
    }

    const listStyle = {
        height: animation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 215],
            extrapolate: 'clamp'
        }),
        transform: [
            {
                translateY: animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 60],
                    extrapolate: 'clamp'
                })
            }
        ]
    }

    const scaleStyle = {
        transform: [
            {
                scale: scale
            }
        ]
    }
    
    const handleInputChange = (text) => {
        if(text) {
            const temporal = masterData.filter(item => {
                const itemData = item.label ? item.label.toUpperCase() : ''.toUpperCase();
                const textData = text.toUpperCase();
                return itemData.indexOf(textData) > -1
            });
            
            setData(temporal)
        } else setData(masterData)
        setText(text)
    }

    const Item = ({value, label}) => {
        return(
            <TouchableOpacity
                onPress={() => {
                    setDropDown({
                        itemValue: value,
                        itemLabel: label
                    })
                    setData(masterData)
                    setToggle(false)
                    setText('')
                }} 
                style={styles.item}
            >
                <View style={styles.titleContainer}>
                    <Text style={{fontSize: 15, fontWeight: '300', color: itemValue === value ? '#adadad' : '#383838'}}>{label}</Text>
                </View>
                {
                    itemValue === value
                    &&
                        <View style={styles.checkContainer}>
                            <Material name={'check'} size={18} color={'green'}/>
                        </View>
                }
            </TouchableOpacity>
        )
    }


    return(
       <View style={styles.dropdownContainer}>
            <TouchableWithoutFeedback
                onPressIn={() => setToggleLong(true)}
                onPressOut={() => setToggleLong(false)}
                onPress={() => setToggle(!toggle)}
            >
                <View style={styles.button}>
                    <View style={styles.leftIcon}>
                        <Material name={toggle ? 'folder-open-outline' : 'folder-outline'} size={18} color={'#2F7EBF'}/>
                    </View>
                    <Animated.View style={[styles.titleBox, translate]}>
                        <Text style={{fontSize: 14, color: '#2F7EBF', fontWeight: '300'}}>Seleccionar elemento</Text>
                    </Animated.View>
                    {
                        itemValue
                        &&
                            <View style={[styles.titleBox, {zIndex: 0}]}>
                                <Text style={{fontSize: 14, fontWeight: '300', color: '#2F7EBF'}}>{itemLabel}</Text>
                            </View>
                    }
                    <Animated.View style={[styles.arrowRight, arrowStyle]}>
                        <Material name={'chevron-right'} size={20} color={'#2F7EBF'}/>
                        <Animated.View style={[styles.circle, scaleStyle]}/>
                    </Animated.View>
                </View>
            </TouchableWithoutFeedback>

            <Animated.View style={[styles.container, listStyle]}>
                <View style={[styles.listContainer, {opacity: 1}]}>

                    {/* search Bar */}

                    <View style={styles.searchBar}>
                        <View style={styles.magnify}>
                            <Material name={'magnify'} size={22} color={'#adadad'}/>
                        </View>
                        <TextInput
                            value={text}
                            onChangeText={handleInputChange}
                            style={styles.input}
                            placeholder='Buscar elemento'
                            placeholderTextColor={'#adadad'}
                        />
                    </View>

                    {/* lista */}

                    <View style={styles.list}>
                        <FlatList 
                            data={data}
                            keyExtractor={(item) => item.value}
                            renderItem={({item}) => 
                                <Item {...item}/>
                            }
                        />
                    </View>
                </View>
            </Animated.View>
       </View>
    )
}

const styles = StyleSheet.create({
    dropdownContainer: {
        height: 'auto',
        alignSelf: 'stretch'
    },
    button: {
        height: 50,
        alignSelf: 'stretch',
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'flex-start',
        borderWidth: 1.8,
        borderColor: '#2F7EBF',
        borderRadius: 4,
        zIndex: 10,
    },
    leftIcon: {
        height: 30,
        width: 30,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        left: 5,
        zIndex: 10
    },
    titleBox: {
        position: 'absolute',
        left: 37,
        backgroundColor: '#fff',
        paddingHorizontal: 4,
        zIndex: 0,
        borderRadius: 8
    },
    arrowRight: {
        height: 50,
        width: 40,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        right: 0,
        zIndex: 10
    },
    circle: {
        height: 35,
        width: 35,
        backgroundColor: 'rgba(64, 122, 195, 0.08)',
        borderRadius: 50,
        position: 'absolute',
        zIndex: 0
    },
    container: {
        width: '100%',
        backgroundColor: '#fff',
        position: 'absolute',
        left: 0,
        borderRadius: 4,
        borderWidth: 1.8, 
        borderColor: '#2F7EBF',
        paddingHorizontal: 8,
        paddingTop: 8,
        zIndex: 0
    },
    listContainer: {
        flex: 1, 
    },
    searchBar: {
        height: 43,
        alignSelf: 'stretch',
        flexDirection: 'row',
        backgroundColor: '#f9f9f9'
    },
    magnify: {
        height: '100%',
        width: 40,
        justifyContent: 'center',
        alignItems: 'center'
    },
    input: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingRight: 8,
        fontWeight: '300',
        fontSize: 15
    },
    list: {
        flex: 1,
        alignSelf: 'stretch'
    },
    item: {
        height: 40,
        alignSelf: 'stretch',
        flexDirection: 'row',
        paddingHorizontal: 8,
    },
    titleContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-start'
    },
    checkContainer: {
        height: '100%',
        width: 40,
        justifyContent: 'center',
        alignItems: 'center',
    }
})