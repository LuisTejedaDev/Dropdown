import {StyleSheet, SafeAreaView, View} from 'react-native'
import {Dropdown} from './components'

//#2F7EBF

export default () => {
    return(
        <SafeAreaView style={{flex: 1, backgroundColor: '#2F7EBF'}}>
            <View style={styles.container}>
                <Dropdown />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: 22
    }
})