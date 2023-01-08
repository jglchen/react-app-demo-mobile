import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface PropsType {
    dataList: string[];
    dataSelect: (idx: number) => void;
    selectIndex: number;
}

export default function ButtonGroup({dataList, dataSelect, selectIndex}: PropsType) {
    return (
    <View style={styles.btnGroup}>
    {dataList.map((item, index) => 
        <TouchableOpacity key={index} style={[styles.btn, selectIndex === index ? { backgroundColor: "green" } : null]} onPress={() => {dataSelect(index)}}>
            <Text style={[styles.btnText, selectIndex === index ? { color: "white" } : null]}>{item}</Text>
        </TouchableOpacity>
    )}    
    </View>
    );

}    

const styles = StyleSheet.create({
    btnGroup: {
        flexDirection: 'row',
        alignItems: "center",
        borderWidth: 1,
        borderColor: '#6B7280'
    },
    btn: {
        flex: 1,
        borderRightWidth: 0.25,
        borderLeftWidth: 0.25,
        borderColor: '#6B7280'
    },
    btnText: {
        textAlign: 'center',
        paddingVertical: 12,
        fontSize: 15
    }
});
  
 
