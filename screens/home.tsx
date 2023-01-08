import React, {useState, useRef} from 'react';
import { 
    SafeAreaView, 
    ScrollView,
    View,
    Text,
    StyleSheet
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { DataTable, Button, TextInput } from 'react-native-paper';
import SelectDropdown from "react-native-select-dropdown";
import { Ionicons } from '@expo/vector-icons';
import { useWindowDimensions } from 'react-native';
import ButtonGroup from '../components/buttongroup';

interface CharacterType {
   name: string;  
   job: string;
   gender: string;
   education: string;
}

export default function HomeScreen() {
     const initialState: CharacterType = {
        name: '',
        job: '',
        gender: '',
        education: '',
     };
     const window = useWindowDimensions();
     const tableHead = ['Name', 'Job', 'Gender', 'Education'];
     const widthArr = [140, 200, 80, 200, 160];
     const tableWidth = 600;
     const [tableData, setTableData] = useState<CharacterType[]>([]);
     const [character, setCharacter] = useState<CharacterType>(initialState);
     const [updateId, setUpdateId] = useState(-1);
     const [selectIndex, setSelectIndex] = useState(-1);
     const [dropdownDefault, setDropdownDefault] = useState(-1);
     const genders = ['Female', 'Male', 'LGBT'];
     const educations = ['Doctor', 'Master', 'Bachelor', 'College w/o Degree', 'High School and below'];
     const dropdownRef = useRef(null);  
  
     function handleNameChange(text: string){
        let value = text.replace(/<\/?[^>]*>/g, "");
        setCharacter(prevState => ({ ...prevState, name: value }));
     }
  
     function selectGender(idx: number){
         setSelectIndex(idx);
         setCharacter(prevState => ({ ...prevState, gender: genders[idx] }));
     }
  
     function handleJobChange(text: string){
        let value = text.replace(/<\/?[^>]*>/g, "");
        setCharacter(prevState => ({ ...prevState, job: value }));
     }
  
     function submitForm(){
        if (!character.name.trim() && !character.job.trim() && !character.gender && !character.education){
           return;
        }
        const tData = tableData.slice();
        if (updateId > - 1){
           tData[updateId] = character;
           setUpdateId(-1);
           setDropdownDefault(-1);
        }else{
           tData.push(character);
        }
        setTableData(tData);
        setSelectIndex(-1);
        (dropdownRef.current as any).reset();
        setCharacter(initialState);
     }
     
     function itemDelete(){
         let tData = tableData.slice();
         tData = tData.filter((item, i) => i !== updateId);
         setTableData(tData);
         setUpdateId(-1);
         setSelectIndex(-1);
         setDropdownDefault(-1);
         (dropdownRef.current as any).reset();
         setCharacter(initialState);
     }
  
     function itemEdit(index: number){
        setUpdateId(index);
        const char = tableData[index];
        setDropdownDefault(educations.indexOf(char.education));
        setCharacter(char);
     }

     const TableContent = () => {
        return (
         <>
         <DataTable.Header>
            {tableHead.map((item, index) => 
              <DataTable.Title key={index}>
               {item}
               </DataTable.Title>
            )}
         </DataTable.Header>
         {tableData.map((item, index) =>
         <DataTable.Row key={index} onPress={() => itemEdit(index)} style={(updateId == index ? {backgroundColor: '#FFF1C1'}: (index%2 ? {backgroundColor: '#f5fcff'}: null))}>
            <DataTable.Cell>
               <View>
                  <Text>{item.name}</Text>
               </View>
            </DataTable.Cell>
            <DataTable.Cell>
               <View>
                  <Text>{item.job}</Text>
               </View>
            </DataTable.Cell>
            <DataTable.Cell>
               <View>
                  <Text>{item.gender}</Text>
               </View>
            </DataTable.Cell>
            <DataTable.Cell>
               <View>
                  <Text>{item.education}</Text>
               </View>
            </DataTable.Cell>
         </DataTable.Row> 
         )}
         </>
        );
     }

     return (
      <SafeAreaView style={styles.container}>
        <KeyboardAwareScrollView
            resetScrollToCoords={{ x: 0, y: 0 }}
            keyboardShouldPersistTaps='handled'
            scrollEnabled={true}
            style={styles.scrollViewContainer}
            >
               <View>
                  <Text style={{fontSize: 16}}>Add a character with a name and a job to the table.</Text>
               </View>
               {/* Table */}
               <View style={styles.tableView}>
                  {window.width * 0.96 > tableWidth &&
                  <DataTable style={{paddingHorizontal: 0}}>                    
                     <TableContent />
                  </DataTable>
                  }
                  {window.width * 0.96 <= tableWidth &&
                  <ScrollView 
                     horizontal={true}
                     showsHorizontalScrollIndicator={true}
                     >
                     <View>
                        <DataTable style={{width: tableWidth}}>                    
                           <TableContent />
                        </DataTable>
                     </View>
                  </ScrollView>
                  }
                  {tableData.length > 0 &&
                  <View>
                     <Text>Please click the row you want to update.</Text>
                  </View>
                  }
               </View>
               <View style={[styles.paragraphView, {marginBottom: 20}]}>
                   <Text style={styles.titleText}>{updateId > -1 ? 'Update Record':'Add New'}</Text>
               </View>
               <View style={styles.paragraphView}>
                  <TextInput
                    mode="outlined"
                    value={character.name}
                    label="Name"
                    placeholder="Name"
                    onChangeText={text => handleNameChange(text)}
                  />
               </View>
               <View style={styles.paragraphView}>
                  <ButtonGroup
                     dataList={genders}
                     dataSelect={selectGender}
                     selectIndex={selectIndex}
                     />
               </View>
               <View style={styles.paragraphView}>
                  <SelectDropdown
                    data={educations}
                    defaultValueByIndex={dropdownDefault}
                    onSelect={(selectedItem, index) => {
                        setCharacter(prevState => ({ ...prevState, education: selectedItem }));
                    }}
                    defaultButtonText={"---Please Select Education---"}
                    buttonTextAfterSelection={(selectedItem, index) => {
                       return selectedItem;
                    }}         
                    rowTextForSelection={(item, index) => {
                       return item;
                    }}        
                    buttonStyle={styles.dropdownBtnStyle}
                    buttonTextStyle={styles.dropdownBtnTxtStyle}
                    renderDropdownIcon={() => {
                      return (
                        <Ionicons name="chevron-down" color={"#444"} size={18} />
                      );
                    }}
                    dropdownIconPosition={"right"}
                    dropdownStyle={styles.dropdownDropdownStyle}
                    rowStyle={styles.dropdownRowStyle}
                    rowTextStyle={styles.dropdownRowTxtStyle}
                    ref={dropdownRef} 
                  />
               </View>
               <View style={styles.paragraphView}>
                  <TextInput
                    mode="outlined"
                    value={character.job}
                    label="Job"
                    placeholder="Job"
                    onChangeText={text => handleJobChange(text)}
                  />
               </View>
               {updateId < 0 &&
               <View style={styles.paragraphView}>
                  <Button mode='contained' onPress={() => submitForm()}>Add New Submit</Button>
               </View>
               }
               {updateId > -1 &&
               <View style={[styles.paragraphView,styles.listButtonView]}>
                  <Button mode='contained' onPress={() => submitForm()}>Update Submit</Button>
                  <Button mode='contained' onPress={() => itemDelete()}>Delete Record</Button>
               </View>
               }
        </KeyboardAwareScrollView>    
      </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    viewContainer: { flex: 1, width: '100%', paddingBottom: 20 },
    scrollViewContainer: {
      paddingVertical: "3%",
      paddingHorizontal: "2%",
    },
    paragraphView: {
       width: "100%",
       marginBottom: 10        
    },
    tableView: {
       width: "100%",
       paddingBottom: 30        
    },
    listButtonView: {
       flexDirection: 'row', 
       justifyContent: 'space-between', 
       paddingBottom: 10
    },
    titleText: {
       fontSize: 20,
       fontWeight: 'bold'
    }, 
    tableHead: { height: 50, borderBottomWidth: 1},
    rowStyle: { flexDirection: 'row', height: 50, borderBottomWidth: 1, borderBottomColor: 'lightgrey'},
 
    dropdownBtnStyle: {
     width: "100%",
     height: 50,
     backgroundColor: "#FFF",
     borderRadius: 8,
     borderWidth: 1,
     borderColor: "#444",
   },
   dropdownBtnTxtStyle: { color: "#444", textAlign: "left" },
   dropdownDropdownStyle: { backgroundColor: "#EFEFEF" },
   dropdownRowStyle: {
     backgroundColor: "#EFEFEF",
     borderBottomColor: "#C5C5C5",
   },
   dropdownRowTxtStyle: { color: "#444", textAlign: "left" },
  
  });
  