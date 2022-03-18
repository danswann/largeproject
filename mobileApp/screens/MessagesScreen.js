const MessagesScreen = () => {
    return (
      <View style=(styles.box}>
        <FlatList
          data={Messages}
          keyExtractor={item=>item.id}
          renderItem={({item}) => (
            <Card>
              <UserInfo>
                <UserImgWrapper>
                  UserImg source=
                </UserImgWrapper>
              </UserInfo>
            </Card>
          )}
        />
      </View>
  
    );
    <StackNavigator>
      <Stack.Screen name = "Messages" component = {MessagesScreen} />
      <Stack.Screen name = "Chat" component = {ChatScreen} />
    </StackNavigator>
  };