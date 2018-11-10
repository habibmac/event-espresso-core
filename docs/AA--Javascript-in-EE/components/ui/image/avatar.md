# `<AvatarImage />`

Outputs a styled image for the provided avatar details.

The following is the shape of the Component:

```jsx
<AvatarImage
    avatarUrl={ '' }
    avatarClass={ 'contact' }
    avatarHeight={ 32 }
    avatarWidth={ 32 }
    avatarAltText={ 'user avatar' }
/>
```

This will output something like:

```html
<div class="contact-image-wrap-div">
  <img src="" class="contact-avatar-img avatar" style="width: 32, height: 32" alt="contact avatar">
</div>
```

## Props

### avatarUrl

The url to the image used for the avatar.  If no url is provided, the component will return null.

- Type: `String`
- Required: No
- Default: ''

### avatarClass

The string to use for the css class prefix.  The outer `div` container will end up with `{ avatarClass } + '-image-wrap-div` and the `img` tag will end up with `{ avatarClass } + '-avatar-img avatar'`

- Type: `String`
- Required: No
- Default: "contact"

### avatarHeight

This will be used for the `height` attribute on the `img` tag.

- Type: `Number`
- Required: No
- Default: 32

### avatarWidth

This will be used for the `width` attribute on the `img` tag.

- Type: `Number`
- Required: No
- Default: 32

### avatarAltText:

This will be used for the value of the `alt` attribute on the `img` tag.

- Type: `String`
- Required: No
