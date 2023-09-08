import { nanoid } from 'nanoid'

export class Error {
  constructor(code, message) {
    return {
      code,
      message
    }
  }
}

export class ModelData {
  constructor({ input_text, input_file_path, output_file_path, create_timestamp, email }) {
    Object.assign(this, {
      id: nanoid(),
      input_text,
      input_file_path,
      output_file_path,
      create_timestamp,
      email
    })
  }
  getRequest() {
    return {
      id: this.id,
      input_text: this.input_text,
      input_file_path: this.input_file_path,
      email: this.email
    }
  }
}