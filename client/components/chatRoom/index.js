import React, {Component} from 'react'
import io from 'socket.io-client'
import {StyleSheet, ScrollView, View, Text, TextInput} from 'react-native'
import axios from 'axios'
import {connect} from 'react-redux'
import {initChatRoom, chatMessageInput, addMessage} from '../../redux/actions'
import {bindActionCreators} from 'redux'

class ChatRoom extends Component {
  componentDidMount() {
    this.props.initChatRoom()
    this.socket = io('https://chat-room2.herokuapp.com')
    this.socket.on('chat message', msg => {
      this.props.addMessage(msg)
    })
  }

  submitChatMessage = () => {
    this.socket.emit('chat message', {msg: this.props.chatMessage, user_id: 1})
    this.props.chatMessageInput('')
  }

  render() {
    const chatMessages = this.props.chatMessages.map((msgInfo, i) => (
      <View key={msgInfo.description + i}>
        <Text style={{color: msgInfo.color}} key={msgInfo.description + i}>
          {msgInfo.name}
        </Text>
        <Text key={msgInfo.description + i + i}>{msgInfo.description}</Text>
      </View>
    ))
    return (
      <ScrollView>
        <View style={styles.container}>
          <TextInput
            style={{height: 40, borderWidth: 2}}
            autoCorrect={false}
            value={this.props.chatMessage}
            onSubmitEditing={this.submitChatMessage}
            onChangeText={chatMessage => this.props.chatMessageInput(chatMessage)}
          />
          {chatMessages}
        </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
})
const mapStateToProps = state => {
  return {
    chatMessage: state.chatRoomReducer.chatMessage,
    chatMessages: state.chatRoomReducer.chatMessages,
  }
}
const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      initChatRoom,
      chatMessageInput,
      addMessage,
    },
    dispatch,
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatRoom)
