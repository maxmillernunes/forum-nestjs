import { Slug } from './slug'

describe('Create Slug', () => {
  it('should be able to create a new slug from text', () => {
    const slug = Slug.createFromText('Example question title')

    expect(slug.value).toEqual('example-question-title')
  })

  it('should be able to create a new slug from text with underline(_)', () => {
    const slug = Slug.createFromText('Another_Example question title')

    expect(slug.value).toEqual('another-example-question-title')
  })

  it('should be able to create a new slug from text with special character(--)', () => {
    const slug = Slug.createFromText('Another_Example question title-@')

    expect(slug.value).toEqual('another-example-question-title')
  })
})
